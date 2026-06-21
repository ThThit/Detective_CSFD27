# Dev 1 — Auth & Session

## Overview
Own the full authentication layer end to end: MSAL OAuth flow, session management, route protection, and the login page UI.

---

## Files to implement

| File | Task |
|---|---|
| `src/lib/auth.ts` | Session helpers — read, write, destroy |
| `middleware.ts` | Route protection |
| `src/app/(auth)/login/page.tsx` | Login page UI |
| `src/app/api/auth/login/route.ts` | Redirect to MSAL |
| `src/app/api/auth/callback/route.ts` | Exchange code, upsert student, set session |
| `src/app/api/auth/me/route.ts` | Return current user data |
| `src/app/api/auth/complete-registration/route.ts` | Save nickname on first login |
| `src/app/api/auth/logout/route.ts` | Destroy session |

---

## Dependencies to install

```bash
npm install @azure/msal-node iron-session
```

- `@azure/msal-node` — MSAL server-side OAuth
- `iron-session` — encrypted cookie-based session

---

## `src/lib/auth.ts` — Session helpers

```ts
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export type SessionData = {
  userId: string;     // student.id (UUID)
  isAdmin: boolean;
};

export async function getSession() { ... }         // returns SessionData | null
export async function setSession(data: SessionData) { ... }
export async function destroySession() { ... }
```

Config:
- Cookie name: `csfd27_session`
- `iron-session` password: from `SESSION_SECRET` env var (min 32 chars)
- `secure: true` in production, `httpOnly: true`, `sameSite: 'lax'`

---

## `middleware.ts` — Route protection

Protected routes (redirect to `/login` if no session):
- `/houses`, `/houses/[house]`
- `/agent`, `/agent/[id]`

Admin-only routes (redirect to `/houses` if not `isAdmin`):
- `/admin/dashboard`

Public routes (always accessible):
- `/`, `/login`, `/api/auth/*`

Use `NextResponse.redirect` with `next/server` middleware.

---

## `src/app/api/auth/login/route.ts` — GET

Redirect the browser to the Microsoft MSAL authorization URL.

MSAL config from env vars:
- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_REDIRECT_URI` (e.g. `http://localhost:3000/api/auth/callback`)

Scopes: `['openid', 'profile', 'email', 'User.Read']`

---

## `src/app/api/auth/callback/route.ts` — GET

1. Exchange the `?code` query param for tokens via MSAL
2. Call Microsoft Graph (`https://graph.microsoft.com/v1.0/me`) to get `displayName`, `mail`, and `id` (used as `studentId`)
3. Upsert into the `student` table — insert if new, update `displayName` if exists
4. Set session with `userId` and `isAdmin`
5. Redirect to `/houses`

Student defaults on first insert:
- `role: 'junior'`
- `isAdmin: false`
- `house: 'tracer'` (placeholder — admin or onboarding flow assigns the real house)
- `guessLeft: 3`

---

## `src/app/api/auth/me/route.ts` — GET

Returns the current user's full profile. Used by every page that needs user context.

Response shape:
```ts
{
  id: string;
  email: string;
  studentId: string;
  role: 'junior' | 'senior' | 'house_leader';
  isAdmin: boolean;
  displayName: string;
  nickname: string | null;
  profileUrl: string | null;
  house: 'tracer' | 'noir' | 'foxlock' | 'cipher';
  guessLeft: number;
  instagram: string | null;
  discord: string | null;
  line: string | null;
  nationality: string | null;
  hints: Hint[];           // received hints (juniors) or given hints (seniors)
  mentee: Student | null;  // populated for seniors/house_leaders
  isFound: boolean;        // true if junior's pcode is found
}
```

Return `401` if no session.

---

## `src/app/api/auth/complete-registration/route.ts` — POST

Called after login if `user.nickname` is null (first login onboarding, handled by Dev 2).

Body: `{ nickname: string }`

Validates:
- Nickname is between 2–30 characters
- Not empty / whitespace only

Updates `student.nickname` for the current session user. Returns updated user. Return `401` if no session.

---

## `src/app/api/auth/logout/route.ts` — POST

Destroys the session cookie, redirects to `/`.

---

## `src/app/(auth)/login/page.tsx` — Login page UI

Reference design: `reference/Login.dc.html`

Design tokens:
- Background: `#F3EEE5` (light parchment)
- Accent: `#A86A2A` (amber)
- Primary text: `#1C1A17`
- Muted text: `#7A6A58`
- Card bg: `#E5E0CF`
- Danger/restricted: `#8b2020`
- Fonts: `Cinzel Decorative` (titles), `Cormorant Garamond` (body), `Special Elite` (labels/codes)

Key elements (match the reference):
- Light parchment `#F3EEE5` background
- Centered CSFD seal graphic in amber `#A86A2A`
- `▸ RESTRICTED ACCESS` classification label in red
- Title: "Case Sensitive / Freshy Day 2027" in Cinzel Decorative
- Divider with `CREDENTIALS REQUIRED` label in Special Elite
- Login card on `#E5E0CF` background
- "Access Case Files" Microsoft login button → links to `/api/auth/login`
- Status bar: pulsing dot + `AWAITING AUTHENTICATION...` in Special Elite
- Footer: `CS DEPT · CPE · FRESHY DAY 2027`

The page is a full-screen centered layout wrapping a mobile-sized card (390px wide). No navbar.

---

## Env vars required

```env
AZURE_CLIENT_ID=
AZURE_TENANT_ID=
AZURE_REDIRECT_URI=http://localhost:3000/api/auth/callback
SESSION_SECRET=                # min 32 random characters
```

---

## Notes

- All API routes that need the current user should import `getSession` from `src/lib/auth.ts`
- Do not expose `isAdmin` or session details to the client beyond what `GET /api/auth/me` returns
- The `house` field is set to `tracer` by default on callback — admin assigns real houses; do not hardcode any house logic here
