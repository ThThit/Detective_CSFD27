import { NextResponse } from "next/server";
import { getSessionData } from "@/lib/auth";
import { db } from "@/db";
import { pcode, student } from "@/db/schema";
import { eq, isNull, isNotNull, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const seniorAlias = alias(student, "senior");
const juniorAlias = alias(student, "junior");

export async function GET(request: Request) {
  const session = await getSessionData();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db.select().from(student).where(eq(student.id, session.userId));
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.role === "junior") {
    const seniors = await db
      .select({ studentId: student.studentId })
      .from(student)
      .where(and(
        eq(student.house, user.house),
        eq(student.role, "senior"),
        isNull(student.deletedAt),
      ));
    const pool = seniors.map((s) => s.studentId.slice(-3));
    return NextResponse.json({ pool });
  }

  if (!session.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Admin: return all pcode pairs with senior + junior data
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "all";

  const whereClause =
    status === "solved"
      ? isNotNull(pcode.foundAt)
      : status === "open"
        ? isNull(pcode.foundAt)
        : undefined;

  const rows = await db
    .select({
      id: pcode.id,
      foundAt: pcode.foundAt,
      createdAt: pcode.createdAt,
      senior: {
        id: seniorAlias.id,
        studentId: seniorAlias.studentId,
        displayName: seniorAlias.displayName,
      },
      junior: {
        id: juniorAlias.id,
        studentId: juniorAlias.studentId,
        displayName: juniorAlias.displayName,
        guessLeft: juniorAlias.guessLeft,
      },
    })
    .from(pcode)
    .innerJoin(seniorAlias, eq(pcode.seniorId, seniorAlias.id))
    .innerJoin(juniorAlias, eq(pcode.juniorId, juniorAlias.id))
    .where(whereClause);

  const pairs = rows.map((row) => ({
    id: row.id,
    senior: row.senior,
    junior: row.junior,
    foundAt: row.foundAt ? row.foundAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  }));

  return NextResponse.json({ pairs });
}
