import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { student } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const storedState = request.cookies.get("oauth_state")?.value;
  const verifier = request.cookies.get("oauth_verifier")?.value;

  if (!code || !state || state !== storedState || !verifier) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_state", request.url),
    );
  }

  const tokenRes = await fetch(
    `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.AZURE_CLIENT_ID!,
        client_secret: process.env.AZURE_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.AZURE_REDIRECT_URI!,
        scope: "openid profile email User.Read",
        code_verifier: verifier,
      }),
    },
  );

  const tokens = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!tokens.access_token) {
    console.error(
      "[auth/callback] token exchange failed:",
      tokens.error,
      tokens.error_description,
    );
    return NextResponse.redirect(
      new URL("/login?error=token_exchange_failed", request.url),
    );
  }

  const graphRes = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!graphRes.ok) {
    console.error("[auth/callback] graph /me failed:", graphRes.status);
    return NextResponse.redirect(
      new URL("/login?error=graph_failed", request.url),
    );
  }
  const graphUser = (await graphRes.json()) as {
    displayName: string;
    mail: string;
    userPrincipalName: string;
  };

  const email = graphUser.mail ?? graphUser.userPrincipalName;
  if (!email) {
    console.error("[auth/callback] graph /me returned no email");
    return NextResponse.redirect(
      new URL("/login?error=graph_failed", request.url),
    );
  }
  const displayName = graphUser.displayName;

  const [localPart, domain] = email.split("@");
  if (domain !== "ad.sit.kmutt.ac.th" || !/^6[89]/.test(localPart)) {
    return NextResponse.redirect(
      new URL("/login?error=unauthorized_account", request.url),
    );
  }

  const studentId = localPart;

  const [existing] = await db
    .select()
    .from(student)
    .where(eq(student.studentId, studentId));

  let userId: string;
  let isAdmin: boolean;

  if (existing) {
    await db
      .update(student)
      .set({ displayName })
      .where(eq(student.id, existing.id));
    userId = existing.id;
    isAdmin = existing.isAdmin;
  } else {
    const [inserted] = await db
      .insert(student)
      .values({
        email,
        studentId,
        displayName,
        role: localPart.startsWith("68") ? "senior" : "junior",
        isAdmin: false,
        house: "noir",
        guessLeft: 3,
      })
      .returning();
    userId = inserted.id;
    isAdmin = false;
  }

  await setSession({ userId, isAdmin });

  const response = NextResponse.redirect(new URL("/houses", request.url));
  response.cookies.delete("oauth_state");
  response.cookies.delete("oauth_verifier");
  return response;
}
