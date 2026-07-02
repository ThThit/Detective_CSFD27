import { NextResponse } from 'next/server';
import { db } from '@/db';
import { student, pcode, hint } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { getSessionData } from '@/lib/auth';
import { toHint } from '@/lib/mappers';


export async function GET() {
    const session = await getSessionData();
    if(!session) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const [user] = await db.select().from(student).where(eq(student.id, session.userId));
    if(!user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const isSenior = user.role === "senior" || user.role === "house_leader";
    const [pcodeRow] = isSenior
    ? await db.select().from(pcode).where(eq(pcode.seniorId, user.id))
    : await db.select().from(pcode).where(eq(pcode.juniorId, user.id));

  if (!pcodeRow) return NextResponse.json({ hints: [] });

  const hintRows = await db
    .select()
    .from(hint)
    .where(and(eq(hint.pcodeId, pcodeRow.id), isNull(hint.deletedAt)));

  const hints = isSenior
    ? hintRows.map(toHint)
    : hintRows.map(toHint).filter((h) => h.isRevealed);

  return NextResponse.json({ hints });
}

