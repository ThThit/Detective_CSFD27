# CSFD27 — Case Sensitive: Freshy Day 2027

A detective-themed mentor-mentee matching game for the CS Department orientation. CS seniors (CS25) go undercover as P'codes; CS juniors (CS26) receive time-gated hints and must identify their senior mentor before running out of attempts.

[Graphic requirements](https://drive.google.com/drive/u/0/folders/1HPvlVPbw57mfDI-eM0wq7FK-sFGMuX0c)

[House(Agency) details](https://docs.google.com/document/d/1mdjW0Ohcxj7ZwRcJ1u5vF6GLwnq5VW_YXmOc-sYLwn0/edit?tab=t.0)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **ORM:** Drizzle
- **Database:** PostgreSQL
- **Auth:** Microsoft OAuth (MSAL) + iron-session
- **Image upload:** Cloudflare R2

## Houses

| Key | House | Color | Tagline |
|-----|-------|-------|---------|
| `evidenceHounds` | Evidence Hounds | Navy `#121358` | Follow the trail of proof |
| `inferenceSociety` | Inference Society | Forest green `#274C27` | Reason from the shadows |
| `cipherFoxes` | Cipher Foxes | Dark crimson `#4C1A17` | Crack the code, catch the quarry |
| `shadowSleuths` | Shadow Sleuths | Deep purple `#402561` | Operate unseen, strike precise |

## Design System

- **Theme:** Light parchment — background `#F3EEE5`, surfaces `#E5E0CF`, accent amber `#A86A2A`
- **Fonts:** Cinzel Decorative (headings) · Cormorant Garamond (body) · Special Elite (labels/codes)
- **Nav tabs (post-auth):** DIVISIONS → `/houses` · AGENT → `/agent` · STATS → `/admin/dashboard`

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page (Microsoft SSO)
│   ├── (main)/                # Authenticated layout + navbar
│   │   ├── houses/            # House directory + onboarding
│   │   ├── houses/[house]/    # House detail + member grid
│   │   ├── agent/             # Own profile — senior view (edit, upload, hints) + junior view (accusation terminal)
│   │   ├── agent/[id]/        # Public member profile
│   │   └── admin/dashboard/   # Admin case board (mobile layout)
│   └── api/
│       ├── auth/              # login, callback, me, complete-registration, logout
│       ├── students/          # GET list, GET/PATCH by id
│       ├── hints/             # GET, PATCH/DELETE by id
│       ├── guess/             # POST
│       └── pcodes/            # GET (junior pool / admin full list)
├── components/
│   ├── ui/                    # button, badge
│   ├── layout/                # navbar
│   ├── house/                 # house-card, agent-card
│   ├── hints/                 # hint-card (senior + junior variants)
│   ├── profile/               # profile-card
│   └── admin/                 # student-table, hint-manager
├── db/
│   ├── schema.ts              # Drizzle schema (student, pcode, hint, mutation_log)
│   ├── index.ts               # DB client
│   └── migrations/
├── lib/
│   ├── auth.ts                # iron-session helpers (getSession, setSession, destroySession)
│   ├── r2.ts                  # Cloudflare R2 upload utility
│   ├── utils.ts               # cn() and misc helpers
│   └── constants/houses.ts    # House metadata (name, color, tagline, description)
├── types/
│   └── index.ts               # Shared types (Student, Hint, Pcode, MeResponse, etc.)
└── hooks/
middleware.ts                  # Route protection
```

## Setup

1. **Clone and install**

   ```sh
   git clone <repo-url>
   cd csfd27
   npm install
   ```

2. **Configure environment variables** — create a `.env.local` file:

   ```env
   # Database
   DATABASE_URL=

   # Microsoft MSAL
   AZURE_CLIENT_ID=
   AZURE_TENANT_ID=
   AZURE_REDIRECT_URI=http://localhost:3000/api/auth/callback

   # Session (min 32 random characters)
   SESSION_SECRET=

   # Cloudflare R2
   R2_ENDPOINT=
   R2_ACCESS_KEY_ID=
   R2_SECRET_ACCESS_KEY=
   R2_BUCKET_NAME=
   R2_PUBLIC_URL=
   ```

3. **Run database migrations**

   ```sh
   npx drizzle-kit migrate
   ```

4. **Start dev server**

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Dev Team

| Dev | Name | GitHub | Ownership |
|-----|------|--------|-----------|
| Dev 1 | Zayar Lin | [@zayarlyn](https://github.com/zayarlyn) | Auth & Session (`src/lib/auth.ts`, MSAL routes, middleware, login page) |
| Dev 2 | Thiha Phone Thaw | [@Daniel-Thiha](https://github.com/Daniel-Thiha) | Landing & Onboarding (`/`, `/houses` onboarding flow, house constants) |
| Dev 3 | Kyaw Zall Thwin | [@kywzallthwin](https://github.com/kywzallthwin) | Houses & Readonly Profiles (house detail, public profile, readonly own profile, student GET APIs) |
| Dev 4 | La Yaung Phyo | [@FreddieTheObserver](https://github.com/FreddieTheObserver) | Own Profile & Image Upload (edit mode, R2 upload, PATCH API) |
| Dev 5 | Kyaw Zin Thant | [@peter3420](https://github.com/peter3420) | Hints System (hints API, hint-card, senior hint management section) |
| Dev 6 | Ye Htet Maung Maung | [@john-yhmm](https://github.com/john-yhmm) | Guessing Game (guess + pcodes APIs, junior accusation terminal on `/agent`) |
| Dev 7 | Thu Htin Thit | [@ThThit](https://github.com/ThThit) | Admin & Shared UI (button, badge, navbar, layout, admin dashboard) |

See `tasks/dev[N].md` for each dev's detailed spec.

## Docs

Additional documentation lives in the `docs/` folder:

- [`docs/architecture.md`](docs/architecture.md) — system architecture overview
- [`docs/auth-flow.md`](docs/auth-flow.md) — Microsoft OAuth + PKCE flow, session management, and error states
