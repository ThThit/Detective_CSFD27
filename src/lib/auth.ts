import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

export type SessionData = {
  userId: string;
  isAdmin: boolean;
};

const COOKIE_NAME = "csfd27";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

export async function setSession(data: SessionData): Promise<void> {
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, cookieOptions);
}

// Memoized per-request: layouts and pages rendered in the same request
// (e.g. (main)/layout.tsx + agent/[id]/page.tsx) can both call this without
// re-decoding/re-verifying the cookie more than once.
export const getSessionData = cache(async (): Promise<SessionData | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const { userId, isAdmin } = payload;
    if (typeof userId !== 'string' || !userId || typeof isAdmin !== 'boolean') return null;
    return { userId, isAdmin };
  } catch {
    return null;
  }
});

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
