import { NextResponse, type NextRequest } from 'next/server';
import { and, asc, eq, isNull, sql } from 'drizzle-orm';
import { db } from '@/db';
import { student } from '@/db/schema';
import { HOUSES } from '@/lib/constants/houses';
import { toPublicStudent } from '@/lib/mappers';

const ROLES = ['junior', 'senior', 'house_leader'] as const;

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get('role');
  const house = request.nextUrl.searchParams.get('house');

  if (role && !ROLES.includes(role as (typeof ROLES)[number])) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  if (house && !HOUSES.includes(house as (typeof HOUSES)[number])) {
    return NextResponse.json({ error: 'Invalid house' }, { status: 400 });
  }

  const filters = [isNull(student.deletedAt)];
  if (role) filters.push(eq(student.role, role));
  if (house) filters.push(eq(student.house, house));

  const rows = await db
    .select()
    .from(student)
    .where(and(...filters))
    .orderBy(
      sql`case ${student.role} when 'house_leader' then 0 when 'senior' then 1 else 2 end`,
      asc(student.displayName)
    );

  return NextResponse.json(rows.map(toPublicStudent));
}
