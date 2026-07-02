import { NextResponse } from 'next/server';
import { getSessionData } from '@/lib/auth';
import { db } from '@/db';
import { student, pcode } from '@/db/schema';
import { eq, isNull, and } from 'drizzle-orm';

export async function POST(request: Request) {
  const session = await getSessionData();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body.studentId !== 'string') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const [user] = await db.select().from(student).where(eq(student.id, session.userId));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (user.role !== 'junior') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [pcodeRow] = await db
    .select()
    .from(pcode)
    .where(and(eq(pcode.juniorId, user.id), isNull(pcode.deletedAt)));
  if (!pcodeRow) return NextResponse.json({ error: 'No case assigned' }, { status: 404 });

  if (pcodeRow.foundAt !== null) {
    return NextResponse.json({ error: 'Case already closed' }, { status: 400 });
  }

  if (user.guessLeft <= 0) {
    return NextResponse.json({ error: 'No attempts remaining' }, { status: 403 });
  }

  const [senior] = await db
    .select()
    .from(student)
    .where(and(
      eq(student.studentId, body.studentId),
      eq(student.role, 'senior'),
      isNull(student.deletedAt),
    ));
  if (!senior) return NextResponse.json({ error: 'Unknown operative' }, { status: 404 });

  if (senior.id === pcodeRow.seniorId) {
    await db
      .update(pcode)
      .set({ foundAt: new Date(), updatedAt: new Date() })
      .where(eq(pcode.id, pcodeRow.id));

    return NextResponse.json({
      correct: true,
      senior: {
        displayName: senior.displayName,
        nickname: senior.nickname,
        house: senior.house,
        profileUrl: senior.profileUrl,
      },
    });
  }

  await db
    .update(student)
    .set({ guessLeft: user.guessLeft - 1, updatedAt: new Date() })
    .where(eq(student.id, user.id));

  return NextResponse.json({ correct: false, livesLeft: user.guessLeft - 1 });
}
