import { ProfileCard } from "@/components/profile/ProfileCard";
import { AccusationTerminal } from "@/components/agent/AccusationTerminal";
import { HintsSection } from "@/components/hints/hints-section";
import { db } from "@/db";
import { student, pcode, hint } from "@/db/schema";
import { getCurrentStudent } from "@/lib/current-student";
import { toPublicStudent, toHint, toHintsAcrossPcodes } from "@/lib/mappers";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import type { Hint, MenteeCase } from "@/types";

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
    const [pcodeRow] = await db
      .select()
      .from(pcode)
      .where(and(eq(pcode.juniorId, row.id), isNull(pcode.deletedAt)));
    if (pcodeRow) {
      isFound = pcodeRow.foundAt !== null;

      const [hintRows, seniorRow] = await Promise.all([
        db
          .select()
          .from(hint)
          .where(and(eq(hint.pcodeId, pcodeRow.id), isNull(hint.deletedAt)))
          .orderBy(asc(hint.createdAt), asc(hint.id)),
        isFound
          ? db
              .select()
              .from(student)
              .where(eq(student.id, pcodeRow.seniorId))
              .then((rows) => rows[0])
          : Promise.resolve(undefined),
      ]);
      hints = hintRows.map((r, i) => toHint(r, i));

      if (isFound) {
        solvedAt = pcodeRow.foundAt!.toISOString();
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
    const pcodeRows = await db
      .select()
      .from(pcode)
      .where(and(eq(pcode.seniorId, row.id), isNull(pcode.deletedAt)));

    if (pcodeRows.length > 0) {
      const [menteeRows, hintRows] = await Promise.all([
        db
          .select()
          .from(student)
          .where(
            inArray(
              student.id,
              pcodeRows.map((p) => p.juniorId),
            ),
          ),
        db
          .select()
          .from(hint)
          .where(
            and(
              inArray(
                hint.pcodeId,
                pcodeRows.map((p) => p.id),
              ),
              isNull(hint.deletedAt),
            ),
          ),
      ]);
      const menteeById = new Map(menteeRows.map((m) => [m.id, m]));

      cases = pcodeRows.flatMap((p) => {
        const menteeRow = menteeById.get(p.juniorId);
        if (!menteeRow) return [];
        return [
          {
            pcodeId: p.id,
            mentee: toPublicStudent(menteeRow),
            isFound: p.foundAt !== null,
          },
        ];
      });
      hints = toHintsAcrossPcodes(hintRows);
    }
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
