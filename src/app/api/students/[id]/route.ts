import { NextResponse } from 'next/server';
import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/db';
import { student } from '@/db/schema';
import { toPublicStudent } from '@/lib/mappers';
import { getSessionData } from '@/lib/auth';
import {
  applyProfileUpdate,
  ProfileValidationError,
} from '@/lib/profile';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  const [row] = await db
    .select()
    .from(student)
    .where(and(eq(student.id, id), isNull(student.deletedAt)))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  return NextResponse.json(toPublicStudent(row));
}

/**
 * PATCH — update your own profile. Thin wrapper around `applyProfileUpdate`
 * (which owns validation, R2 image upload, and persistence). The route's only
 * jobs are auth + ownership: a student may update only their own dossier.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  const session = await getSessionData();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.userId !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const updated = await applyProfileUpdate(id, body);
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ProfileValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('PATCH /api/students/[id] failed:', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
