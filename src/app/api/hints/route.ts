import { NextResponse } from "next/server";
import { db } from "@/db";
import { student, pcode, hint } from "@/db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { getSessionData } from "@/lib/auth";
import { toHintsAcrossPcodes } from "@/lib/mappers";

export async function GET() {
  const session = await getSessionData();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db
    .select()
    .from(student)
    .where(eq(student.id, session.userId));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const isSenior = user.role === "senior" || user.role === "house_leader";
  // A senior can be mentoring more than one junior at once, so every
  // active (non-deleted) pcode pairing must be included, not just one.
  const pcodeRows = isSenior
    ? await db
        .select()
        .from(pcode)
        .where(and(eq(pcode.seniorId, user.id), isNull(pcode.deletedAt)))
    : await db
        .select()
        .from(pcode)
        .where(and(eq(pcode.juniorId, user.id), isNull(pcode.deletedAt)));

  if (pcodeRows.length === 0) return NextResponse.json({ hints: [] });

  const hintRows = await db
    .select()
    .from(hint)
    .where(
      and(
        inArray(
          hint.pcodeId,
          pcodeRows.map((p) => p.id),
        ),
        isNull(hint.deletedAt),
      ),
    );

  const hints = toHintsAcrossPcodes(hintRows);

  return NextResponse.json({ hints });
}
