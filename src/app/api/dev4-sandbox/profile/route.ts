// TEMPORARY — Dev 4 isolation harness. DELETE before opening the PR.
// Mirrors the future `PATCH /api/students/[id]` so the profile editor can be
// tested end-to-end before Dev 3 merges the shared `students/[id]/route.ts`.
// When integrating: move this PATCH body into that route, adding the
// `session.userId === params.id` ownership check (403 otherwise).
import { NextResponse, type NextRequest } from 'next/server';
import { getSessionData } from '@/lib/auth';
import {
  applyProfileUpdate,
  ProfileValidationError,
  type ProfilePatchInput,
} from '@/lib/profile';

export async function PATCH(request: NextRequest) {
  const session = await getSessionData();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = (await request.json()) as ProfilePatchInput;
    const updated = await applyProfileUpdate(session.userId, body);
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ProfileValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('[dev4-sandbox/profile] update failed', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
