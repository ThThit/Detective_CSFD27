# Dev 7 — Admin Dashboard & Shared UI

## Overview
Own the shared UI components that all other devs depend on, and the admin dashboard. **Start immediately** — other devs block on `button.tsx`, `badge.tsx`, and `navbar.tsx`.

---

## Files to implement

| File | Task | Priority |
|---|---|---|
| `src/components/ui/button.tsx` | Shared button component | **First** |
| `src/components/ui/badge.tsx` | Shared badge component | **First** |
| `src/components/layout/navbar.tsx` | App navbar | **First** |
| `src/app/(main)/layout.tsx` | Main layout wrapper | **First** |
| `src/app/not-found.tsx` | 404 page | Low |
| `src/app/(main)/admin/dashboard/page.tsx` | Admin case board | After shared UI |
| `src/components/admin/student-table.tsx` | Pairing table component | After shared UI |

---

## Design tokens

- Background: `#F3EEE5` (parchment), surfaces: `#E5E0CF` (aged paper)
- Accent (amber): `#A86A2A`
- Primary text: `#1C1A17`, Muted: `#7A6A58`, `#A0907E`, `#C4B8A8`
- Danger: `#8b2020`, Success: `#3a6a2a`
- Fonts: `Cinzel Decorative` (headings), `Cormorant Garamond` (body), `Special Elite` (labels/codes)

---

## `src/components/ui/button.tsx`

```ts
type ButtonProps = {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
```

Variants:
- `primary` — amber `#A86A2A` border + text, transparent bg; hover bg `rgba(168,106,42,0.08)`
- `danger` — `#2F241F` dark solid bg, `#F3EEE5` text (or `#8b2020` bg for destructive)
- `ghost` — no border, muted `#7A6A58` text

Font: `Special Elite` monospace, letter-spacing 2px, uppercase.

---

## `src/components/ui/badge.tsx`

```ts
type BadgeProps = {
  house?: 'tracer' | 'noir' | 'foxlock' | 'cipher';
  role?: 'junior' | 'senior' | 'house_leader';
  children?: React.ReactNode;
};
```

House badge: house primary color border + text + faint bg tint.
- `tracer` → `#121358`
- `noir` → `#274C27`
- `foxlock` → `#4C1A17`
- `cipher` → `#402561`

Role badge: `senior`/`house_leader` → red tint `rgba(139,32,32,0.1)`; `junior` → muted `rgba(122,106,88,0.12)`.

Font: `Special Elite`, all caps, letter-spacing 1px. Text size 7–8px.

Used in member grids, profile cards, and admin tables throughout the app.

---

## `src/components/layout/navbar.tsx`

Reference: `reference/Houses.dc.html` and `reference/Profile.dc.html` navbars (top bar + bottom tabs).

### Top bar
- `CSFD27` logo in Cinzel Decorative (links to `/houses`)
- Right slot: user's house badge (from `/api/auth/me`)
- Context-specific additions (back arrow, edit button) are added per-page, not in the shared navbar

### Bottom tabs (mobile, 3 tabs)

```
DIVISIONS → /houses
AGENT     → /agent
STATS     → /admin/dashboard
```

- Active tab: amber `#A86A2A` underline bar (14px wide, 1.5px tall) + amber text in Special Elite
- Inactive: muted `#7A6A58` text, opacity 0.4
- Fixed at bottom with `padding-bottom: 34px` (safe area for iOS home indicator)
- Background: `#E5E0CF`, top border: `1px solid rgba(47,36,31,0.1)`
- Show bottom tabs only in the `(main)` layout group — not on login or landing

Active detection: use `usePathname()` to highlight the correct tab.

Props:
```ts
type NavbarProps = {
  user?: { house: string; nickname: string | null } | null;
  rightSlot?: React.ReactNode; // for per-page additions (edit button, back arrow)
};
```

---

## `src/app/(main)/layout.tsx`

Wraps all pages in the `(main)` route group.

- Renders `<Navbar />` at top
- Fetches current user from `/api/auth/me` (server component) and passes to navbar
- Main content area with `flex-1 overflow-y-auto`
- Bottom tabs via navbar (rendered inside `<Navbar />`)

---

## `src/app/not-found.tsx`

Detective-themed 404. Light parchment theme:
- Background: `#F3EEE5`
- `CASE FILE NOT FOUND` in Cinzel Decorative `#1C1A17`
- `ERROR 404 · FILE DOES NOT EXIST` in red Special Elite
- "Return to Bureau HQ" link → `/houses` in amber
- Optional: `CLASSIFIED` watermark stamp in `rgba(168,106,42,0.05)`

---

## `src/app/(main)/admin/dashboard/page.tsx`

Reference: `reference/AdminDashboard.dc.html`

Server-render check: if `user.isAdmin === false`, redirect to `/houses`.

This is a **mobile layout** (no sidebar). Bottom tabs are shown.

### Header
- `CSFD27` in Cinzel Decorative + `BUREAU COMMAND` subtitle in Special Elite
- `ACTIVE OPERATION` red label

### Stats row (3 columns on `#E5E0CF` card)
- TOTAL · SOLVED · OPEN
- Counts in Cinzel Decorative large, labels in Special Elite muted

### Filter tabs
- ALL · SOLVED · OPEN
- Active tab: amber underline + amber text (Special Elite)

### Table
Render `<StudentTable />` with the fetched pairs.

Fetch: `GET /api/pcodes?status=all`

---

## `src/components/admin/student-table.tsx`

Reference: `reference/AdminDashboard.dc.html` table.

```ts
type StudentTableProps = {
  pairs: Array<{
    id: string;
    senior: { studentId: string; };
    junior: { studentId: string; guessLeft: number; };
    foundAt: string | null;
  }>;
  filter: 'all' | 'solved' | 'open';
};
```

**Simplified 3-column mobile table:**

| SENIOR | JUNIOR | STATUS |
|---|---|---|
| `65XXXXXXXX` | `66XXXXXXXX` | SOLVED / OPEN |

- Show student codes (65XXXXXXXX / 66XXXXXXXX format), not names
- Status:
  - `SOLVED` — green dot + green text in Special Elite
  - `OPEN` — muted dot + muted text
- Rows: `#E5E0CF` on hover/alternate, border `rgba(47,36,31,0.06)`
- Font: `Special Elite` monospace for all codes

Filtering (client-side, driven by parent `filter` prop):
- `solved` → show only `foundAt !== null`
- `open` → show only `foundAt === null`
- `all` → show all

`fadeIn` animation per row with stagger delay.
