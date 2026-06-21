import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import type { SessionData } from "@/lib/auth";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function getSession(request: NextRequest): Promise<SessionData | null> {
  const token = request.cookies.get("csfd27")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const { userId, isAdmin } = payload;
    if (typeof userId !== 'string' || !userId || typeof isAdmin !== 'boolean') return null;
    return { userId, isAdmin };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);

  if (pathname.startsWith("/admin")) {
    if (!session?.isAdmin) {
      return NextResponse.redirect(new URL("/houses", request.url));
    }
  } else if (pathname.startsWith("/houses") || pathname.startsWith("/agent")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/houses",
    "/houses/:path*",
    "/agent",
    "/agent/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
