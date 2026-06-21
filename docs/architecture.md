# CSFD27 Architecture

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **ORM:** Drizzle
- **Database:** PostgreSQL
- **Auth:** Microsoft OAuth (MSAL) + iron-session (encrypted cookie)
- **Image upload:** Cloudflare R2

---

## Design System

**Fonts:**
- `Cinzel Decorative 700` — headings, titles, display
- `Cormorant Garamond 400/600` — body text, serif
- `Special Elite` — monospace labels, codes, stamps

**Colors:**
- Background: `#F3EEE5` (parchment)
- Card/surface: `#E5E0CF` (aged paper)
- Primary text: `#1C1A17`
- Muted text: `#7A6A58`, `#A0907E`, `#C4B8A8`
- Accent (amber): `#A86A2A`
- Danger: `#8b2020`
- Success: `#3a6a2a`

---

## Frontend Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Landing — investigation board hero, countdown, Microsoft login CTA; redirect to `/houses` if authenticated |
| `/login` | `app/(auth)/login/page.tsx` | Classified access screen — Microsoft SSO prompt |
| `/houses` | `app/(main)/houses/page.tsx` | House directory — grid of 4 houses; onboarding overlay (nickname + magic pot) if `user.nickname` is null |
| `/houses/[house]` | `app/(main)/houses/[house]/page.tsx` | House detail — dossier header, lore, member grid (leaders first) |
| `/agent` | `app/(main)/agent/page.tsx` | Own profile — **Senior view:** edit info, upload pic, mentee + hint cards. **Junior view:** accusation terminal, evidence hints, case solved/expired states |
| `/agent/[id]` | `app/(main)/agent/[id]/page.tsx` | Public readonly dossier — pic, name, house, social links |
| `/admin/dashboard` | `app/(main)/admin/dashboard/page.tsx` | Admin only — mentor-pair table with ALL/SOLVED/OPEN filter |
| `/*` | `app/not-found.tsx` | 404 |

---

## API Routes

### `/api/auth`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/auth/login` | — | Redirect to MSAL authorization URL |
| `GET` | `/api/auth/callback` | — | Exchange code, upsert student, set iron-session, redirect to `/houses` |
| `POST` | `/api/auth/complete-registration` | required | Save nickname on first login |
| `GET` | `/api/auth/me` | required | Current user: profile, hints, mentee, isFound, isAdmin |
| `POST` | `/api/auth/logout` | — | Destroy session cookie |

### `/api/students`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/students` | — | All students; `?role=senior\|junior\|house_leader` and `?house=` filters |
| `GET` | `/api/students/[id]` | — | Single student public profile |
| `PATCH` | `/api/students/[id]` | required (self only) | Update profile; triggers R2 upload if `profilePic` is a data URI |

### `/api/hints`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/hints` | required | Senior: all 3 hints for their mentee. Junior: only revealed hints (`revealDate <= now`) |
| `PATCH` | `/api/hints/[id]` | required (senior, before reveal date) | Update hint content |
| `DELETE` | `/api/hints/[id]` | required (senior, before reveal date) | Soft-delete hint |

### `/api/guess`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/guess` | required (junior only) | Submit guess by student ID; correct → set `pcode.foundAt`; wrong → decrement `student.guessLeft` |

### `/api/pcodes`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/pcodes` | required | Junior: last-3-digit codes for seniors in same house (anonymous pool). Admin: full mentor-pair list with `?status=solved\|open\|all` |

---

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── admin/dashboard/page.tsx
│   │   ├── agent/
│   │   │   ├── page.tsx               # Senior + Junior views in one page
│   │   │   └── [id]/page.tsx
│   │   └── houses/
│   │       ├── page.tsx
│   │       └── [house]/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── callback/route.ts
│   │   │   ├── complete-registration/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── guess/route.ts
│   │   ├── hints/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── pcodes/route.ts
│   │   └── students/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   │   ├── hint-manager.tsx
│   │   └── student-table.tsx
│   ├── hints/
│   │   └── hint-card.tsx
│   ├── house/
│   │   ├── agent-card.tsx
│   │   └── house-card.tsx
│   ├── layout/
│   │   └── navbar.tsx
│   ├── profile/
│   │   └── profile-card.tsx
│   └── ui/
│       ├── badge.tsx
│       └── button.tsx
├── db/
│   ├── index.ts              # Drizzle + postgres client
│   ├── schema.sql
│   └── schema.ts             # student, pcode, hint, mutation_log tables
├── lib/
│   ├── auth.ts               # iron-session: getSession, setSession, destroySession
│   ├── r2.ts                 # Cloudflare R2 upload utility
│   ├── utils.ts              # cn() helper
│   └── constants/
│       └── houses.ts         # House metadata (name, color, tagline, description, heroBg)
├── hooks/
└── types/
    └── index.ts              # Shared types: Student, Hint, Pcode, MeResponse, HouseKey, Role
middleware.ts                 # Route protection
```

---

## Houses

| Key | Display Name | Primary Color |
|---|---|---|
| `tracer` | Tracer - Evidence Tracker | `#121358` (navy) |
| `noir` | Noir - Shadow Spy | `#274C27` (forest green) |
| `foxlock` | Foxlock - Sly Messenger | `#4C1A17` (dark crimson) |
| `cipher` | Cipher - Clue Analyst | `#402561` (deep purple) |

## Roles

| Value | Description |
|---|---|
| `junior` | CS26 freshmen — receive hints, submit guesses via /agent junior view |
| `senior` | CS25 — write hints, assigned one junior mentee |
| `house_leader` | CS25 senior who leads a house — same powers as senior + displayed first in member grid |
| Admin | Hardcoded by `student.isAdmin` — access to `/admin/dashboard` and full `/api/pcodes` |

## Navigation (main app, post-auth)

Bottom tab bar with 3 tabs:

| Label | Route |
|---|---|
| DIVISIONS | `/houses` |
| AGENT | `/agent` |
| STATS | `/admin/dashboard` |

## Session

Managed by `iron-session` (encrypted cookie `csfd27_session`). Session shape:

```ts
{ userId: string; isAdmin: boolean }
```

## Common Env Vars

```env
DATABASE_URL=
AZURE_CLIENT_ID=
AZURE_TENANT_ID=
AZURE_REDIRECT_URI=
SESSION_SECRET=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```
