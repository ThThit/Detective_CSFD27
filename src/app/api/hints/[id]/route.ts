import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pcode, hint } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { getSessionData } from '@/lib/auth';
import { toHint } from '@/lib/mappers';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSessionData();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [hintRow] = await db
    .select()
    .from(hint)
    .where(and(eq(hint.id, id), isNull(hint.deletedAt)));
  if (!hintRow) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [pcodeRow] = await db
    .select()
    .from(pcode)
    .where(eq(pcode.id, hintRow.pcodeId));
  if (!pcodeRow || pcodeRow.seniorId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (hintRow.revealDate <= new Date()) {
    return NextResponse.json({ error: 'Cannot edit a released hint' }, { status: 403 });
  }

  const body = await request.json();
  const content = typeof body.content === 'string' ? body.content : '';
  if (content.length > 500) {
    return NextResponse.json({ error: 'Content too long (max 500 chars)' }, { status: 400 });
  }

  const [updated] = await db
    .update(hint)
    .set({ content, updatedAt: new Date() })
    .where(eq(hint.id, id))
    .returning();

  return NextResponse.json({ hint: toHint(updated) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSessionData();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [hintRow] = await db
    .select()
    .from(hint)
    .where(and(eq(hint.id, id), isNull(hint.deletedAt)));
  if (!hintRow) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [pcodeRow] = await db
    .select()
    .from(pcode)
    .where(eq(pcode.id, hintRow.pcodeId));
  if (!pcodeRow || pcodeRow.seniorId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await db.update(hint).set({ deletedAt: new Date() }).where(eq(hint.id, id));
  return NextResponse.json({ ok: true });
}
