import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { student } from '@/db/schema';
import { uploadToR2 } from '@/lib/r2';
import { toPublicStudent } from '@/lib/mappers';
import type { PublicStudent } from '@/types';

/**
 * Route-agnostic profile-update logic for Dev 4.
 *
 * Deliberately kept out of `src/app/api/students/[id]/route.ts`: that file is
 * shared with Dev 3 (who owns `GET`). Once Dev 3 merges, the PATCH handler is a
 * thin wrapper that does the session + ownership check and calls
 * `applyProfileUpdate` — so there is nothing here to merge-conflict on.
 */

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'] as const;
type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

// ~2MB of binary ≈ 2.7M base64 characters.
const MAX_BASE64_LENGTH = 2_700_000;

export type ProfilePatchInput = {
  nickname?: string;
  profilePic?: string; // base64 data URI — triggers an R2 upload
  instagram?: string;
  discord?: string;
  line?: string;
};

const MAX_CONTACT_FIELD_LENGTH = 50;

/** Thrown for any client-correctable problem (maps to HTTP 400). */
export class ProfileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileValidationError';
  }
}

const PROFILE_PATCH_FIELDS = new Set<keyof ProfilePatchInput>([
  'nickname',
  'profilePic',
  'instagram',
  'discord',
  'line',
]);

/** Restrict self-service profile changes to the fields owned by this UI. */
export function validateProfilePatchInput(input: unknown): ProfilePatchInput {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new ProfileValidationError('Profile update must be an object');
  }

  const body = input as Record<string, unknown>;
  if (Object.keys(body).some((field) => !PROFILE_PATCH_FIELDS.has(field as keyof ProfilePatchInput))) {
    throw new ProfileValidationError('Only nickname, profilePic, instagram, discord, and line can be updated');
  }
  if (body.nickname !== undefined && typeof body.nickname !== 'string') {
    throw new ProfileValidationError('Nickname must be a string');
  }
  if (body.profilePic !== undefined && typeof body.profilePic !== 'string') {
    throw new ProfileValidationError('profilePic must be a string');
  }
  for (const field of ['instagram', 'discord', 'line'] as const) {
    if (body[field] !== undefined && typeof body[field] !== 'string') {
      throw new ProfileValidationError(`${field} must be a string`);
    }
  }

  return body as ProfilePatchInput;
}

/** Parse a `data:<mime>;base64,<payload>` URI into an upload-ready buffer. */
export function parseImageDataUri(
  dataUri: string,
): { contentType: AllowedImageType; buffer: Buffer } {
  const match = /^data:([^;]+);base64,([\s\S]+)$/.exec(dataUri);
  if (!match) {
    throw new ProfileValidationError('profilePic must be a base64 data URI');
  }

  const [, contentType, base64] = match;
  if (!ALLOWED_IMAGE_TYPES.includes(contentType as AllowedImageType)) {
    throw new ProfileValidationError('profilePic must be a JPEG or PNG image');
  }
  if (base64.length > MAX_BASE64_LENGTH) {
    throw new ProfileValidationError('Image is too large (max ~2MB)');
  }

  return {
    contentType: contentType as AllowedImageType,
    buffer: Buffer.from(base64, 'base64'),
  };
}

/**
 * Validate a PATCH body, upload the picture if present, and persist the update.
 * Returns the updated student in its public (non-sensitive) shape.
 */
export async function applyProfileUpdate(
  userId: string,
  input: unknown,
): Promise<PublicStudent> {
  const body = validateProfilePatchInput(input);
  const updates: Partial<typeof student.$inferInsert> = {};

  if (body.nickname !== undefined) {
    const nickname = body.nickname.trim();
    if (nickname.length < 2 || nickname.length > 30) {
      throw new ProfileValidationError('Nickname must be between 2 and 30 characters');
    }
    updates.nickname = nickname;
  }

  if (body.profilePic !== undefined) {
    const { contentType, buffer } = parseImageDataUri(body.profilePic);

    const [existing] = await db
      .select({ nickname: student.nickname, studentId: student.studentId })
      .from(student)
      .where(eq(student.id, userId));
    const nickname = updates.nickname ?? existing?.nickname ?? undefined;

    const url = await uploadToR2(
      `production/profiles/${crypto.randomUUID()}.jpg`,
      buffer,
      contentType,
      {
        userId,
        ...(nickname ? { nickname } : {}),
        ...(existing?.studentId ? { studentId: existing.studentId } : {}),
      },
    );
    updates.profileUrl = url;
  }

  for (const field of ['instagram', 'discord', 'line'] as const) {
    const value = body[field];
    if (value === undefined) continue;
    const trimmed = value.trim();
    if (trimmed.length > MAX_CONTACT_FIELD_LENGTH) {
      throw new ProfileValidationError(`${field} must be at most ${MAX_CONTACT_FIELD_LENGTH} characters`);
    }
    updates[field] = trimmed.length === 0 ? null : trimmed;
  }

  if (Object.keys(updates).length === 0) {
    throw new ProfileValidationError('No valid fields to update');
  }

  updates.updatedAt = new Date();

  const [updated] = await db
    .update(student)
    .set(updates)
    .where(eq(student.id, userId))
    .returning();

  if (!updated) {
    throw new ProfileValidationError('Student not found');
  }

  return toPublicStudent(updated);
}
