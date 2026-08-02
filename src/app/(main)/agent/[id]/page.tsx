import { ProfileCard } from "@/components/profile/ProfileCard";
import { AccusationTerminal } from "@/components/agent/AccusationTerminal";
import { HintsSection } from "@/components/hints/hints-section";
import { db } from "@/db";
import { student, pcode, hint } from "@/db/schema";
import { getCurrentStudent } from "@/lib/current-student";
import { toPublicStudent, toHint, toHintsAcrossPcodes } from "@/lib/mappers";
import { and, asc, eq, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { notFound, redirect } from "next/navigation";
import type { Hint, MenteeCase } from "@/types";

const seniorStudent = alias(student, "senior_student");
const menteeStudent = alias(student, "mentee_student");

type AgentProfilePageProps = {
  params: Promise<{ id: string }>;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function AgentProfilePage({
  params,
}: AgentProfilePageProps) {
  const { id } = await params;

  const isMe = id === "me";

  let row;
  if (isMe) {
    row = await getCurrentStudent();
    if (!row) redirect("/api/auth/login");
  } else {
    if (!uuidPattern.test(id)) notFound();
    [row] = await db
      .select()
      .from(student)
      .where(and(eq(student.id, id), isNull(student.deletedAt)))
      .limit(1);
    if (!row) notFound();
  }

  const publicStudent = toPublicStudent(row);
  const caseNumber = `#2027-CSFD-${publicStudent.house.toUpperCase().slice(0, 3)}-${publicStudent.studentId.slice(-3)}`;

  let hints: Hint[] = [];
  let cases: MenteeCase[] = [];
  let isFound = false;
  let solvedSenior: {
    displayName: string;
    nickname: string | null;
    house: string;
    profileUrl: string | null;
  } | null = null;
  let solvedAt: string | null = null;

  if (isMe && row.role === "junior") {
    const rows = await db
      .select({ pcode, hint, senior: seniorStudent })
      .from(pcode)
      .leftJoin(hint, and(eq(hint.pcodeId, pcode.id), isNull(hint.deletedAt)))
      .leftJoin(seniorStudent, eq(seniorStudent.id, pcode.seniorId))
      .where(and(eq(pcode.juniorId, row.id), isNull(pcode.deletedAt)))
      .orderBy(asc(hint.createdAt), asc(hint.id));

    const pcodeRow = rows[0]?.pcode;
    if (pcodeRow) {
      isFound = pcodeRow.foundAt !== null;

      const hintRows = rows.flatMap((r) => (r.hint ? [r.hint] : []));
      hints = hintRows.map((r, i) => toHint(r, i));

      if (isFound) {
        solvedAt = pcodeRow.foundAt!.toISOString();
        const seniorRow = rows[0]?.senior;
        if (seniorRow) {
          solvedSenior = {
            displayName: seniorRow.displayName,
            nickname: seniorRow.nickname,
            house: seniorRow.house,
            profileUrl: seniorRow.profileUrl,
          };
        }
      }
    }
  } else if (
    isMe &&
    (row.role === "senior" || row.role === "house_leader")
  ) {
    const rows = await db
      .select({ pcode, mentee: menteeStudent, hint })
      .from(pcode)
      .leftJoin(menteeStudent, eq(menteeStudent.id, pcode.juniorId))
      .leftJoin(hint, and(eq(hint.pcodeId, pcode.id), isNull(hint.deletedAt)))
      .where(and(eq(pcode.seniorId, row.id), isNull(pcode.deletedAt)));

    const pcodeById = new Map<
      string,
      { pcode: typeof pcode.$inferSelect; mentee: typeof student.$inferSelect | null }
    >();
    const hintRows: (typeof hint.$inferSelect)[] = [];
    for (const r of rows) {
      if (!pcodeById.has(r.pcode.id)) {
        pcodeById.set(r.pcode.id, { pcode: r.pcode, mentee: r.mentee });
      }
      if (r.hint) hintRows.push(r.hint);
    }

    cases = Array.from(pcodeById.values()).flatMap(({ pcode: p, mentee }) => {
      if (!mentee) return [];
      return [
        {
          pcodeId: p.id,
          mentee: { ...toPublicStudent(mentee), guessLeft: mentee.guessLeft },
          isFound: p.foundAt !== null,
        },
      ];
    });
    hints = toHintsAcrossPcodes(hintRows);
  }

  return (
    <div className="min-h-screen flex flex-col font-serif">
      <main className="flex-1 overflow-y-auto p-5 pb-24">
        <ProfileCard student={publicStudent} editable={isMe} />

        {/* === DEV 5: Mentee & Hints section === */}
        {isMe &&
          (publicStudent.role === "senior" ||
            publicStudent.role === "house_leader") && (
            <div className="mx-auto max-w-content mt-6">
              <HintsSection hints={hints} cases={cases} />
            </div>
          )}

        {isMe && row.role === "junior" && (
          <section className="relative overflow-hidden max-w-content mx-auto mt-4">
            <AccusationTerminal
              initialGuessLeft={row.guessLeft}
              initialIsFound={isFound}
              initialHints={hints}
              initialSolvedSenior={solvedSenior}
              initialSolvedAt={solvedAt}
            />
          </section>
        )}

        {!isMe && (
          <div className="mx-auto max-w-content my-8 bg-surface border border-dark/8 p-5 text-center relative overflow-hidden torn-edges">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] font-display text-[30px] whitespace-nowrap pointer-events-none tracking-[4px] text-accent/5">
              ON FILE
            </div>
            <div className="text-[10px] text-muted-fg tracking-[3px] mb-1.5 font-mono relative">
              CASE FILE REFERENCE
            </div>
            <div className="font-mono text-[13px] text-muted tracking-[2px] relative">
              {caseNumber}
            </div>
            <div className="mt-2.5 text-[10px] text-subtle tracking-[1px] font-mono relative">
              ISSUED BY CSFD DEPARTMENT · CONFIDENTIAL
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
