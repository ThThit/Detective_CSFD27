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

// Free-text contact/profile fields share a simple upper bound.
const MAX_TEXT_LENGTH = 100;

const TEXT_FIELDS = ['nationality', 'instagram', 'discord', 'line'] as const;

export type ProfilePatchInput = {
  nickname?: string;
  nationality?: string;
  instagram?: string;
  discord?: string;
  line?: string;
  profilePic?: string; // base64 data URI — triggers an R2 upload
};

/** Thrown for any client-correctable problem (maps to HTTP 400). */
export class ProfileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileValidationError';
  }
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
  body: ProfilePatchInput,
): Promise<PublicStudent> {
  const updates: Partial<typeof student.$inferInsert> = {};

  if (body.nickname !== undefined) {
    const nickname = body.nickname.trim();
    if (nickname.length < 2 || nickname.length > 30) {
      throw new ProfileValidationError('Nickname must be between 2 and 30 characters');
    }
    updates.nickname = nickname;
  }

  for (const field of TEXT_FIELDS) {
    const value = body[field];
    if (value === undefined) continue;
    const trimmed = value.trim();
    if (trimmed.length > MAX_TEXT_LENGTH) {
      throw new ProfileValidationError(`${field} must be ${MAX_TEXT_LENGTH} characters or fewer`);
    }
    updates[field] = trimmed.length === 0 ? null : trimmed;
  }

  if (body.profilePic !== undefined) {
    const { contentType, buffer } = parseImageDataUri(body.profilePic);
    const url = await uploadToR2(`profiles/${userId}.jpg`, buffer, contentType);
    // The key is stable per user, so bust the CDN/browser cache to show the new pic.
    updates.profileUrl = `${url}?v=${Date.now()}`;
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
