# Auth Flow

## Overview

Authentication is Microsoft OAuth 2.0 with PKCE. Sessions are stateless JWTs stored in an httpOnly cookie. Only `@ad.sit.kmutt.ac.th` accounts whose local part starts with `68` or `69` are admitted.

---

## Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/login` | GET | Initiates OAuth flow |
| `/api/auth/callback` | GET | Handles Microsoft redirect, upserts user, sets session |
| `/api/auth/me` | GET | Returns current user's full profile |
| `/api/auth/complete-registration` | POST | Sets nickname after first login |
| `/api/auth/logout` | POST | Destroys session cookie |

---

## Step-by-step Flow

### 1. Login — `GET /api/auth/login`

- Generates a **PKCE pair**: random 32-byte `verifier` and its `challenge` (`SHA-256(verifier)`, base64url-encoded)
- Generates a random `state` UUID for CSRF protection
- Stores `oauth_state` and `oauth_verifier` in short-lived httpOnly cookies (5 min TTL)
- Redirects to Microsoft's authorize endpoint with `challenge`, `state`, and scopes `openid profile email User.Read`

### 2. Callback — `GET /api/auth/callback`

1. **State check** — compares `?state` query param against `oauth_state` cookie; rejects if mismatched (CSRF guard)
2. **Token exchange** — POSTs to `login.microsoftonline.com/.../token` with `code`, `code_verifier`, and `client_secret`
3. **Graph call** — fetches `https://graph.microsoft.com/v1.0/me` to get `id`, `displayName`, `mail`/`userPrincipalName`
4. **Email gate** — rejects if domain isn't `ad.sit.kmutt.ac.th` or local part doesn't match `/^6[89]/`
5. **DB upsert**:
   - Existing student → updates `displayName`, reads existing `id` and `isAdmin`
   - New student → inserts with `role: "senior"` (prefix `68`) or `"junior"` (prefix `69`), `isAdmin: false`, `house: "noir"`, `guessLeft: 3`
6. **Session** — calls `setSession({ userId, isAdmin })` which signs a JWT and sets the `csfd27` cookie
7. Clears PKCE/state cookies, redirects to `/houses`

### 3. Session — `src/lib/auth.ts`

Sessions are stateless JWT-in-cookie:

- **`setSession(data)`** — signs a `HS256` JWT (`JWT_SECRET`) containing `{ userId, isAdmin }`, valid 7 days; sets as cookie `csfd27` (httpOnly, sameSite=lax, secure in prod)
- **`getSessionData()`** — reads the `csfd27` cookie, verifies the JWT, returns `{ userId, isAdmin }` or `null` on failure/absence
- **`destroySession()`** — deletes the `csfd27` cookie

### 4. Logout — `POST /api/auth/logout`

Calls `destroySession()` and redirects to `/`.

---

## PKCE Explained

PKCE (Proof Key for Code Exchange) prevents an attacker who intercepts the authorization `code` from exchanging it for tokens.

```
verifier  = random 32 bytes (kept secret on server, stored in cookie)
challenge = base64url(SHA-256(verifier))  (sent to Microsoft)
```

Microsoft stores the `challenge` when issuing the `code`. At token exchange, you send the `verifier`. Microsoft recomputes `SHA-256(verifier)` and checks it matches — proving you initiated the flow.

An intercepted `code` is useless without the `verifier`, which never appears in any URL.

This app uses both PKCE and `client_secret` (defense-in-depth; recommended by Microsoft and required by OAuth 2.1 even for confidential clients).

---

## Sequence Diagram

```
Browser                    App Server                    Microsoft
  │                            │                              │
  │── GET /api/auth/login ────►│                              │
  │                            │  generate PKCE + state       │
  │                            │  set oauth_state cookie      │
  │                            │  set oauth_verifier cookie   │
  │◄── 302 ───────────────────►│──── 302 to MS authorize ────►│
  │                                                           │
  │◄──────────────── 302 to /api/auth/callback?code=... ─────│
  │                            │                              │
  │── GET /api/auth/callback ─►│                              │
  │                            │  validate state              │
  │                            │  POST token exchange ────────►│
  │                            │◄── access_token ─────────────│
  │                            │  GET /graph/v1.0/me ─────────►│
  │                            │◄── user info ────────────────│
  │                            │  email domain check          │
  │                            │  upsert student in DB        │
  │                            │  sign JWT → set csfd27 cookie│
  │                            │  clear oauth_* cookies       │
  │◄── 302 /houses ───────────│                              │
```

---

## Error States

| Error query param | Cause |
|---|---|
| `invalid_state` | `state` mismatch or missing PKCE cookies (expired or tampered) |
| `token_exchange_failed` | Microsoft rejected the code exchange |
| `unauthorized_account` | Email domain or student ID prefix check failed |
