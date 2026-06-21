import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import { student } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionData } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSessionData();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as { nickname?: string };
  const nickname = body.nickname?.trim();

  if (!nickname || nickname.length < 2 || nickname.length > 30) {
    return NextResponse.json({ error: 'Nickname must be between 2 and 30 characters' }, { status: 400 });
  }

  const [updated] = await db
    .update(student)
    .set({ nickname })
    .where(eq(student.id, session.userId))
    .returning();

  return NextResponse.json(updated);
}
