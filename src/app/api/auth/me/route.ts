import { NextResponse } from 'next/server';
import { db } from '@/db';
import { student, pcode, hint } from '@/db/schema';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { getSessionData } from '@/lib/auth';
import { toPublicStudent, toHint, toHintsAcrossPcodes } from '@/lib/mappers';
import type { MeResponse, MenteeCase, Hint } from '@/types';

export async function GET() {
  const session = await getSessionData();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user] = await db.select().from(student).where(eq(student.id, session.userId));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let hints: Hint[] = [];
  let cases: MenteeCase[] = [];
  let isFound = false;

  if (user.role === 'junior') {
    const [pcodeRow] = await db
      .select()
      .from(pcode)
      .where(and(eq(pcode.juniorId, user.id), isNull(pcode.deletedAt)));
    if (pcodeRow) {
      isFound = pcodeRow.foundAt !== null;
      const hintRows = await db.select().from(hint).where(eq(hint.pcodeId, pcodeRow.id));
      hints = hintRows.map(toHint).filter((h) => h.isRevealed);
    }
  } else {
    // A senior can be mentoring more than one junior at once, so this must
    // account for every active (non-deleted) pcode pairing, not just one.
    const pcodeRows = await db
      .select()
      .from(pcode)
      .where(and(eq(pcode.seniorId, user.id), isNull(pcode.deletedAt)));

    if (pcodeRows.length > 0) {
      const menteeRows = await db
        .select()
        .from(student)
        .where(inArray(student.id, pcodeRows.map((p) => p.juniorId)));
      const menteeById = new Map(menteeRows.map((m) => [m.id, m]));

      cases = pcodeRows.flatMap((p) => {
        const menteeRow = menteeById.get(p.juniorId);
        if (!menteeRow) return [];
        return [{
          pcodeId: p.id,
          mentee: { ...toPublicStudent(menteeRow), guessLeft: menteeRow.guessLeft },
          isFound: p.foundAt !== null,
        }];
      });
      isFound = cases.length > 0 && cases.every((c) => c.isFound);

      const hintRows = await db
        .select()
        .from(hint)
        .where(inArray(hint.pcodeId, pcodeRows.map((p) => p.id)));
      hints = toHintsAcrossPcodes(hintRows);
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
    cases,
    isFound,
  };

  return NextResponse.json(body);
}
