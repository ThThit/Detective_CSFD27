import { NextResponse } from 'next/server';
import { db } from '@/db';
import { student, pcode, hint } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionData } from '@/lib/auth';
import type { MeResponse, PublicStudent, Hint } from '@/types';

export async function GET() {
  const session = await getSessionData();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user] = await db.select().from(student).where(eq(student.id, session.userId));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let hints: Hint[] = [];
  let mentee: PublicStudent | null = null;
  let isFound = false;

  if (user.role === 'junior') {
    const [pcodeRow] = await db.select().from(pcode).where(eq(pcode.juniorId, user.id));
    if (pcodeRow) {
      isFound = pcodeRow.foundAt !== null;
      const hintRows = await db.select().from(hint).where(eq(hint.pcodeId, pcodeRow.id));
      hints = hintRows.map((h) => ({
        id: h.id,
        pcodeId: h.pcodeId,
        content: h.content,
        revealDate: h.revealDate.toISOString(),
        isRevealed: h.revealDate <= new Date(),
        createdAt: h.createdAt.toISOString(),
        updatedAt: h.updatedAt.toISOString(),
      }));
    }
  } else {
    const [pcodeRow] = await db.select().from(pcode).where(eq(pcode.seniorId, user.id));
    if (pcodeRow) {
      const [menteeRow] = await db.select().from(student).where(eq(student.id, pcodeRow.juniorId));
      if (menteeRow) {
        mentee = {
          id: menteeRow.id,
          studentId: menteeRow.studentId,
          role: menteeRow.role as PublicStudent['role'],
          displayName: menteeRow.displayName,
          nickname: menteeRow.nickname,
          profileUrl: menteeRow.profileUrl,
          house: menteeRow.house as PublicStudent['house'],
          instagram: menteeRow.instagram,
          discord: menteeRow.discord,
          line: menteeRow.line,
          nationality: menteeRow.nationality,
          createdAt: menteeRow.createdAt.toISOString(),
          updatedAt: menteeRow.updatedAt.toISOString(),
        };
      }
      const hintRows = await db.select().from(hint).where(eq(hint.pcodeId, pcodeRow.id));
      hints = hintRows.map((h) => ({
        id: h.id,
        pcodeId: h.pcodeId,
        content: h.content,
        revealDate: h.revealDate.toISOString(),
        isRevealed: h.revealDate <= new Date(),
        createdAt: h.createdAt.toISOString(),
        updatedAt: h.updatedAt.toISOString(),
      }));
    }
  }

  const body: MeResponse = {
    id: user.id,
    email: user.email,
    studentId: user.studentId,
    role: user.role as MeResponse['role'],
    isAdmin: user.isAdmin,
    displayName: user.displayName,
    nickname: user.nickname,
    profileUrl: user.profileUrl,
    house: user.house as MeResponse['house'],
    guessLeft: user.guessLeft,
    instagram: user.instagram,
    discord: user.discord,
    line: user.line,
    nationality: user.nationality,
    hints,
    mentee,
    isFound,
  };

  return NextResponse.json(body);
}
