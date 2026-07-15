import type { student, hint } from '@/db/schema';
import type { PublicStudent, Hint } from '@/types';
import { HINT_RELEASE_DATES } from '@/lib/constants/hints';

type StudentRow = typeof student.$inferSelect;
type HintRow = typeof hint.$inferSelect;

export function toPublicStudent(row: StudentRow): PublicStudent {
  return {
    id: row.id,
    studentId: row.studentId,
    role: row.role as PublicStudent['role'],
    displayName: row.displayName,
    nickname: row.nickname,
    profileUrl: row.profileUrl,
    house: row.house as PublicStudent['house'],
    instagram: row.instagram,
    discord: row.discord,
    line: row.line,
    nationality: row.nationality,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toHint(row: HintRow, position: number): Hint {
  const revealDate = HINT_RELEASE_DATES[position];
  const isRevealed = revealDate <= new Date();
  return {
    id: row.id,
    pcodeId: row.pcodeId,
    content: isRevealed ? row.content : '',
    revealDate: revealDate.toISOString(),
    isRevealed,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
