import { cache } from "react";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { student } from "@/db/schema";
import { getSessionData } from "@/lib/auth";

// Memoized per-request so every server component that needs "the logged-in
// student's row" during the same render (layout + page, etc.) shares one
// DB query instead of each re-fetching it.
export const getCurrentStudent = cache(async () => {
  const session = await getSessionData();
  if (!session) return null;

  const [row] = await db
    .select()
    .from(student)
    .where(and(eq(student.id, session.userId), isNull(student.deletedAt)))
    .limit(1);

  return row ?? null;
});
