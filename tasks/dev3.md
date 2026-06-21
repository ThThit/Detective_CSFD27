# Dev 3 — Houses & Readonly Profiles

## Overview
Own the house detail page, the public member profile, and the **readonly** version of the own-profile page. Dev 4, Dev 5, and Dev 6 will all extend `/agent/page.tsx` after this is merged.

**Finish and merge before Dev 4, Dev 5, and Dev 6 start their work.**

---

## Files to implement

| File | Task |
|---|---|
| `src/app/(main)/houses/[house]/page.tsx` | House detail — dossier header + member grid |
| `src/app/(main)/agent/[id]/page.tsx` | Public readonly profile |
| `src/app/(main)/agent/page.tsx` | Own profile — **readonly skeleton only** for both senior and junior roles |
| `src/app/api/students/route.ts` | `GET /api/students` with filters |
| `src/app/api/students/[id]/route.ts` | `GET /api/students/[id]` |
| `src/components/house/agent-card.tsx` | Member grid card |
| `src/components/profile/profile-card.tsx` | Dossier-style profile card |

---

## Design tokens

- Background: `#F3EEE5`, cards/surfaces: `#E5E0CF`
- Accent (amber): `#A86A2A`
- Primary text: `#1C1A17`, Muted: `#7A6A58`, `#A0907E`
- Danger: `#8b2020`, Success: `#3a6a2a`
- Fonts: `Cinzel Decorative` (headings), `Cormorant Garamond` (body), `Special Elite` (labels/codes)

House primary colors (import from `src/lib/constants/houses.ts`):
- Tracer `#121358` · Noir `#274C27` · Foxlock `#4C1A17` · Cipher `#402561`

---

## `src/app/api/students/route.ts` — GET

Returns all non-deleted students.

Query params:
- `?role=senior|junior|house_leader` — filter by role
- `?house=tracer|noir|foxlock|cipher` — filter by house

Response: array of student objects (exclude sensitive fields: no `guessLeft` for others, no `isAdmin`).

Sort order: `house_leader` first, then `senior`, then `junior`. Within each role, alphabetical by `displayName`.

---

## `src/app/api/students/[id]/route.ts` — GET

Returns a single student by UUID. Returns `404` if not found or soft-deleted.

Exclude: `isAdmin`, `guessLeft`.

---

## `src/components/house/agent-card.tsx`

Used in the member grid on the house detail page.

```ts
type AgentCardProps = {
  student: {
    id: string;
    displayName: string;
    nickname: string | null;
    profileUrl: string | null;
    role: 'junior' | 'senior' | 'house_leader';
    house: string;
  };
};
```

Design (from `reference/HouseDetail.dc.html` operatives grid):
- `#E5E0CF` card with subtle `1px` border `rgba(47,36,31,0.1)`
- Circular profile photo (36px, placeholder if no `profileUrl`)
- Display name in Cinzel Decorative 12px
- Nickname in muted `#7A6A58`, Cormorant Garamond italic
- Role badge in house primary color
- `fadeIn` animation with stagger delay
- Clicking navigates to `/agent/[id]`

---

## `src/components/profile/profile-card.tsx`

Core reusable profile display. Used on `/agent/[id]` and `/agent` (readonly mode).

```ts
type ProfileCardProps = {
  student: {
    id: string;
    displayName: string;
    nickname: string | null;
    profileUrl: string | null;
    role: 'junior' | 'senior' | 'house_leader';
    house: string;
    nationality: string | null;
    instagram: string | null;
    discord: string | null;
    line: string | null;
  };
  onEdit?: () => void; // optional — pass from Dev 4 to enable edit button
};
```

Design (from `reference/PublicProfile.dc.html` and `reference/Profile.dc.html`):

**Dossier header** (`#E5E0CF` bg):
- `AGENT DOSSIER · READ ONLY` classification label in Special Elite red
- `CLASSIFIED` diagonal watermark in `rgba(168,106,42,0.05)`
- Profile photo (80×96px) with amber corner brackets and `VERIFIED` green tag
- Display name in Cinzel Decorative 17px
- `Alias: [nickname]` in `#A86A2A` Cormorant Garamond
- House badge + role badge in Special Elite (use house primary color)
- Nationality in muted Cormorant Garamond

**Contact channels** section:
- Instagram, Discord, Line rows — each with branded color icon, label in Special Elite, value in Cormorant Garamond
- Rows on `#F3EEE5` bg with subtle border
- Readonly: just display the value (or `—` if not set)

**Case file reference** footer block (on public `/agent/[id]` profile):
- `CASE FILE REFERENCE` label in Special Elite
- Case number in muted Special Elite
- `ISSUED BY CS DEPT · CONFIDENTIAL`

If `onEdit` is provided, show an `EDIT FILE` button in the navbar area (pass through to Dev 4).

---

## `src/app/(main)/agent/[id]/page.tsx` — Public profile

Reference: `reference/PublicProfile.dc.html`

- Fetch student via `GET /api/students/[id]`
- Render `<ProfileCard student={student} />` (no `onEdit`)
- Back arrow `‹` in navbar linking to previous page or `/houses`
- `CSFD27` logo in navbar (Cinzel Decorative)
- Readonly notice: "This is a read-only dossier. To edit your own profile, navigate to /agent." in Cormorant Garamond
- Bottom tabs with AGENT active

---

## `src/app/(main)/agent/page.tsx` — Own profile (readonly skeleton)

Reference: `reference/Profile.dc.html` — readonly view only for now

- Fetch current user via `GET /api/auth/me`
- Redirect to `/login` if not authenticated (middleware handles this, but handle null state gracefully)
- Render `<ProfileCard student={user} />` — pass `onEdit` as empty placeholder (`() => {}`) so Dev 4 can replace it
- EDIT FILE button visible in navbar but does nothing yet (Dev 4 will wire it up)
- Below the profile card, add these section placeholder comments so each dev can slot in their section:

```tsx
{/* === DEV 4: Edit mode controls (senior/junior shared) === */}

{/* === DEV 5: Mentee & Hints section — seniors/house_leaders only === */}

{/* === DEV 6: Accusation terminal — juniors only === */}
```

- Do NOT render anything in these sections yet

Bottom tabs with AGENT active.

---

## `src/app/(main)/houses/[house]/page.tsx` — House detail

Reference: `reference/HouseDetail.dc.html`

- Validate `[house]` param against known keys — 404 if invalid
- Fetch members: `GET /api/students?house=[house]`
- House colors/metadata from `src/lib/constants/houses.ts`

### Layout

**Navbar**
- Back arrow `‹` to `/houses`
- `CSFD27` logo in Cinzel Decorative
- House badge in house primary color

**Hero banner** (full-width, house primary color background — dark colored)
- House primary color as bg with subtle radial glow
- `DIVISION DOSSIER` stamp (Special Elite, stampIn animation)
- House name in Cinzel Decorative white/light text
- Tagline, member count badge, `ACTIVE` badge
- House description paragraph below divider

**Senior Operatives** section
- Labeled `SENIOR OPERATIVES` in red Special Elite
- List of `house_leader` and `senior` students as horizontal cards on `#E5E0CF`
- Each card: circular photo (48px), name in Cinzel Decorative, alias in italic Cormorant Garamond, role badges
- House leaders get a larger card style with house-color left border

**Operatives grid**
- Labeled `OPERATIVES` in muted Special Elite
- 2-column grid of `<AgentCard />` for junior members

Bottom tabs with DIVISIONS active.
