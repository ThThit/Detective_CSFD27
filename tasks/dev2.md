# Dev 2 — Landing & Onboarding

## Overview
Own the first-contact experience: the public landing page and the onboarding flow that runs on first login (nickname + magic pot house reveal).

---

## Files to implement

| File | Task |
|---|---|
| `src/app/page.tsx` | Landing page — investigation board hero, countdown, login CTA |
| `src/app/(main)/houses/page.tsx` | House grid + onboarding overlay |
| `src/components/house/house-card.tsx` | Reusable house card component |
| `src/lib/constants/houses.ts` | House metadata constants |

---

## Design tokens (consistent across all pages)

- Background: `#F3EEE5` (parchment)
- Card/surface: `#E5E0CF` (aged paper)
- Primary text: `#1C1A17`
- Muted text: `#7A6A58`, `#A0907E`, `#C4B8A8`
- Accent (amber): `#A86A2A`
- Danger: `#8b2020`
- Fonts: `Cinzel Decorative` (headings), `Cormorant Garamond` (body), `Special Elite` (labels/codes)

House primary colors:
| House | Key | Color |
|---|---|---|
| Tracer - Evidence Tracker | `tracer` | `#121358` (navy) |
| Noir - Shadow Spy | `noir` | `#274C27` (forest green) |
| Foxlock - Sly Messenger | `foxlock` | `#4C1A17` (dark crimson) |
| Cipher - Clue Analyst | `cipher` | `#402561` (deep purple) |

---

## `src/lib/constants/houses.ts`

```ts
export const HOUSE_META = {
  tracer: {
    name: 'Tracer',
    tagline: 'Evidence Tracker',
    color: '#121358',
    rgb: [18, 19, 88] as const,
    desc: 'Tracer - Evidence Tracker leave no clue unexamined...',
    heroBg: '#0d0e2e',
  },
  noir: {
    name: 'Noir',
    tagline: 'Shadow Spy',
    color: '#274C27',
    rgb: [39, 76, 39] as const,
    desc: 'Noir - Shadow Spy connects what others overlook...',
    heroBg: '#162416',
  },
  foxlock: {
    name: 'Foxlock',
    tagline: 'Sly Messenger',
    color: '#4C1A17',
    rgb: [76, 26, 23] as const,
    desc: 'Foxlock - Sly Messenger thrive where logic meets mystery...',
    heroBg: '#2a0f0d',
  },
  cipher: {
    name: 'Cipher',
    tagline: 'Clue Analyst',
    color: '#402561',
    rgb: [64, 37, 97] as const,
    desc: 'Cipher - Clue Analyst move through the margins...',
    heroBg: '#261540',
  },
} as const;

export const HOUSES = ['noir', 'foxlock', 'tracer', 'cipher'] as const;
export type House = (typeof HOUSES)[number];
```

---

## `src/app/page.tsx` — Landing page

Reference: `reference/Landing.dc.html`

This page is public (no auth required). If the user is already authenticated, redirect to `/houses` on load.

### Layout (mobile-first, full screen scroll)

**Navbar**
- `CSFD27` logo in Cinzel Decorative, `EST. 2027` label right in Special Elite

**Investigation board hero** (fixed height ~286px, dark corkboard)
- Dark textured background (`#1a1408`) with grid lines overlay — keeps the drama even in the new light theme
- 4 pinned evidence cards scattered at angles (photos, case notes) — purely decorative, static HTML
- Red strings connecting pins (SVG lines)
- `CLASSIFIED` stamp bottom-right (rotate -6deg, stampIn animation on load)
- `CASE #2027-CSFD` bottom-left in Special Elite

**Heading section** (on light `#F3EEE5` background)
- `▸ ACTIVE INVESTIGATION` label in red Special Elite
- Title: "Case Sensitive: Freshy Day 2027" in Cinzel Decorative 24px
- Subtitle paragraph in Cormorant Garamond muted

**Countdown block**
- Pulsing amber dot + `CASE DEADLINE` label in Special Elite
- 4 columns: DAYS · HRS · MIN · SEC in Cinzel Decorative 42px
- Seconds in `#A86A2A` amber, rest in `#1C1A17`
- Target date: `2027-08-25T23:59:59+07:00`
- Live countdown using `useEffect` + `setInterval` (1s tick)
- `TARGET: 25 AUG 2027 · 23:59 ICT` footer in Special Elite

**CTA button**
- Full-width dark `#2F241F` block
- "Access Case Files" in Cinzel Decorative
- "LOGIN WITH MICROSOFT · SSO" subtitle in Special Elite
- Links to `/api/auth/login`

**Page footer** — `A CS Department Production / Computer Engineering · Freshy Day 2027` in Special Elite

No bottom tabs on this page.

---

## `src/components/house/house-card.tsx`

Used in the houses grid. Props:

```ts
type HouseCardProps = {
  houseKey: HouseKey;
  memberCount: number;
  onClick?: () => void;
};
```

Design from `reference/Houses.dc.html` house cards:
- `#E5E0CF` card (aged paper) with colored left border (4px, house primary color)
- Or: card with house-colored header band at top
- House name in Cinzel Decorative
- Tagline in Cormorant Garamond muted
- Member count badge in house primary color text
- Hover: slight lift (`translateY(-2px)`) + border brightens
- Click navigates to `/houses/[houseKey]`

House icons/emblems (reference for each):
- **Tracer**: magnifying glass or paw print
- **Noir**: deduction/logic symbol (Σ or tree)
- **Foxlock**: fox or cipher wheel
- **Cipher**: eye or shadow figure

---

## `src/app/(main)/houses/page.tsx` — Houses directory + onboarding

Reference: `reference/Houses.dc.html`

### Data fetching
- Call `GET /api/auth/me` on load to get current user
- If `user.nickname === null` → show onboarding overlay on mount

### House grid
- `DETECTIVE DIVISIONS` label header in Special Elite red
- Title: "Choose Your Division" in Cinzel Decorative
- 2-column grid of `<HouseCard />` components
- Member counts fetched from `GET /api/students?house=X` or included in `/api/auth/me`

### Onboarding overlay (show when `nickname === null`)
Renders on top of the blurred house grid (`filter: blur(2px)` on background when open).

Bottom sheet slides up from below.

**Step 1 — Alias Assignment**
- Label: `STEP 1 OF 2 · ALIAS ASSIGNMENT` in Special Elite
- Title: "Choose Your Alias" in Cinzel Decorative
- Text input with `›` prefix, amber caret
- "Confirm Alias" dark `#2F241F` button → validate (2–30 chars, not empty) → POST `/api/auth/complete-registration` with `{ nickname }` → advance to step 2

**Step 2 — Magic Pot House Reveal**
- Label: `STEP 2 OF 2 · DIVISION ASSIGNMENT` in Special Elite
- Title: "The Magic Pot Decides" in Cinzel Decorative
- Spinning amber ring animation (1s), then reveal after 1.2s delay
- House reveal card animates in: `YOU HAVE BEEN ASSIGNED TO` + house name + tagline
- House card uses the house primary color as accent
- "Enter Division HQ" button → dismiss overlay

> The house is already assigned server-side at registration (stored on `student.house`). Dev 2 only reads it from the `/api/auth/me` response — does not assign the house.

---

## Notes

- Countdown must handle server/client hydration — use `useState` with initial `'--'` and set real values only inside `useEffect`
- The onboarding overlay is client-side state only — no route change, just a modal
- Do not implement the `/api/auth/complete-registration` route (that's Dev 1) — just call it
- After nickname save, re-fetch `/api/auth/me` or update local state so the overlay doesn't reopen
- Bottom tabs are NOT shown on the landing page (`/`) — only in the `(main)` route group
