import { ProfileCard } from "@/components/profile/ProfileCard";
import { db } from "@/db";
import { student } from "@/db/schema";
import { getSessionData } from "@/lib/auth";
import { toPublicStudent } from "@/lib/mappers";
import { and, eq, isNull } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

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

  let resolvedId: string;
  if (isMe) {
    const session = await getSessionData();
    if (!session) redirect("/login");
    resolvedId = session.userId;
  } else {
    if (!uuidPattern.test(id)) notFound();
    resolvedId = id;
  }

  const [row] = await db
    .select()
    .from(student)
    .where(and(eq(student.id, resolvedId), isNull(student.deletedAt)))
    .limit(1);

  if (!row) notFound();

  const publicStudent = toPublicStudent(row);
  const caseNumber = `#2027-CSFD-${publicStudent.house.toUpperCase().slice(0, 3)}-${publicStudent.studentId.slice(-3)}`;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-serif">
      <main className="flex-1 overflow-y-auto p-5">
        <ProfileCard student={publicStudent} editable={isMe} />

        {!isMe && (
          <div className="mx-auto max-w-content my-8 bg-background border border-dark/8 p-5 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[5deg] font-display text-[30px] whitespace-nowrap pointer-events-none tracking-[4px] text-accent/5">
              ON FILE
            </div>
            <div className="text-[8px] text-muted-fg tracking-[3px] mb-1.5 font-mono relative">
              CASE FILE REFERENCE
            </div>
            <div className="font-mono text-[13px] text-muted tracking-[2px] relative">
              {caseNumber}
            </div>
            <div className="mt-2.5 text-[8px] text-subtle tracking-[1px] font-mono relative">
              ISSUED BY CS DEPARTMENT · CONFIDENTIAL
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
