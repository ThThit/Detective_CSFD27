import { NextResponse } from 'next/server';
import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/db';
import { student } from '@/db/schema';
import { toPublicStudent } from '@/lib/mappers';

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
