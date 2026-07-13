import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { student } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setSession } from "@/lib/auth";

const DEV_ADMIN_STUDENT_ID = "68000000";

/**
 * Dev-only session bypass — skips the Microsoft OAuth round trip and logs
 * in as an admin account, creating it if it doesn't exist yet. Disabled
 * outside development.
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [existing] = await db
    .select()
    .from(student)
    .where(eq(student.studentId, DEV_ADMIN_STUDENT_ID));

  let userId: string;

  if (existing) {
    if (!existing.isAdmin) {
      await db
        .update(student)
        .set({ isAdmin: true })
        .where(eq(student.id, existing.id));
    }
    userId = existing.id;
  } else {
    const [inserted] = await db
      .insert(student)
      .values({
        email: `${DEV_ADMIN_STUDENT_ID}@dev.local`,
        studentId: DEV_ADMIN_STUDENT_ID,
        displayName: "Dev Admin",
        nickname: "Dev Admin",
        role: "senior",
        isAdmin: true,
        house: "noir",
        guessLeft: 3,
      })
      .returning();
    userId = inserted.id;
  }

  await setSession({ userId, isAdmin: true });

  // Behind ngrok, the Host header seen by the dev server is often
  // "localhost:3000" while the original request was https — building the
  // redirect from request.url then produces an unreachable https://localhost
  // URL. Prefer the forwarded host/proto ngrok sets when present.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const origin = forwardedHost
    ? `${forwardedProto ?? "https"}://${forwardedHost}`
    : request.nextUrl.origin;

  return NextResponse.redirect(new URL("/admin/dashboard", origin));
}
