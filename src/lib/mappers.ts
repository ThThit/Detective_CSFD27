import type { student, hint } from '@/db/schema';
import type { PublicStudent, Hint } from '@/types';

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

export function toHint(row: HintRow): Hint {
  return {
    id: row.id,
    pcodeId: row.pcodeId,
    content: row.content,
    revealDate: row.revealDate.toISOString(),
    isRevealed: row.revealDate <= new Date(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
