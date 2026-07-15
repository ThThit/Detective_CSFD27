import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { student } from "@/db/schema";
import { HOUSE_META, HOUSES, type House } from "@/lib/constants/houses";
import { toPublicStudent } from "@/lib/mappers";
import type { PublicStudent } from "@/types";

const ROLE_LABELS: Record<PublicStudent["role"], string> = {
  house_leader: "HOUSE LEADER",
  senior: "SENIOR",
  junior: "JUNIOR",
};

function isHouse(value: string): value is House {
  return (HOUSES as readonly string[]).includes(value);
}

function StudentCard({
  agent,
  delayMs = 0,
}: {
  agent: PublicStudent;
  delayMs?: number;
}) {
  const meta = HOUSE_META[agent.house];
  const [r, g, b] = meta.rgb;
  const isLeader = agent.role === "house_leader";

  return (
    <Link
      href={`/agent/${agent.id}`}
      className="flex items-center gap-3 p-3.5 no-underline text-inherit bg-surface"
      style={{
        border: `1px solid rgba(${r},${g},${b},0.2)`,
        borderLeft: isLeader
          ? `4px solid ${meta.color}`
          : `1px solid rgba(${r},${g},${b},0.2)`,
        animation: `fadeIn 0.4s ease-out ${delayMs}ms both`,
      }}
    >
      <div
        className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-background"
        style={{ border: `2px solid rgba(${r},${g},${b},0.3)` }}
      >
        {agent.profileUrl ? (
          <Image
            src={agent.profileUrl}
            alt={`${agent.displayName} profile`}
            width={48}
            height={48}
            unoptimized
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-[7px] text-muted-fg text-center leading-[1.3] font-mono tracking-[1px]">
            PHOTO
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-display text-[13px] text-foreground mb-0.5 leading-[1.3]">
          {agent.displayName}
        </div>
        <div className="text-xs text-muted mb-1.5">
          Alias:{" "}
          <span className="font-semibold" style={{ color: meta.color }}>
            {agent.nickname ?? "Pending"}
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <div
            className="px-[7px] py-0.5 text-[7px] tracking-[1px] font-mono"
            style={{
              background: `rgba(${r},${g},${b},0.12)`,
              border: `1px solid rgba(${r},${g},${b},0.25)`,
              color: meta.color,
            }}
          >
            {ROLE_LABELS[agent.role]}
          </div>
        </div>
      </div>

      <div className="text-lg text-subtle">›</div>
    </Link>
  );
}

export default async function HousePage({
  params,
}: {
  params: Promise<{ house: string }>;
}) {
  const { house: houseParam } = await params;
  if (!isHouse(houseParam)) notFound();

  const house = houseParam;
  const meta = HOUSE_META[house];
  const [r, g, b] = meta.rgb;

  const rows = await db
    .select()
    .from(student)
    .where(and(eq(student.house, house), isNull(student.deletedAt)))
    .orderBy(
      sql`case ${student.role} when 'house_leader' then 0 when 'senior' then 1 else 2 end`,
      asc(student.displayName),
    );

  const members = rows.map(toPublicStudent);
  const leaders = members.filter((m) => m.role === "house_leader");
  const seniors = members.filter((m) => m.role === "senior");
  const juniors = members.filter((m) => m.role === "junior");

  return (
    <div className="min-h-screen bg-background flex flex-col font-serif">
      <main className="flex-1 overflow-y-auto">
        {/* Hero banner */}
        <div
          className="relative overflow-hidden border-b-[3px] border-b-background/35 torn-bottom"
          style={{ background: meta.color }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(color-mix(in srgb,var(--color-background) 4%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--color-background) 4%,transparent) 1px,transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg,color-mix(in srgb,var(--color-background) 6%,transparent),transparent 60%)",
            }}
          />

          <div className="relative max-w-content mx-auto px-5 pt-6 pb-5">
            <div
              className="inline-block border border-background/25 px-2 py-0.5 mb-3.5"
              style={{ animation: "stampIn 0.7s ease-out both" }}
            >
              <div className="text-[7px] text-background/50 tracking-[3px] font-mono">
                DIVISION DOSSIER
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0 text-white border-2 border-background/25 bg-background/6">
                logo
              </div>

              <div className="flex-1">
                <div className="font-display text-[22px] text-background leading-[1.15] mb-1.5">
                  {meta.name} - {meta.tagline}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-2 py-0.5 text-[8px] tracking-[1px] font-mono bg-background/12 border border-background/25 text-background/80">
                    {members.length} AGENTS
                  </div>
                  <div className="px-2 py-0.5 bg-success/25 border border-success/45 text-[8px] text-[#8aca80] tracking-[1px] font-mono">
                    ACTIVE
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-background/12">
              <div className="whitespace-pre-wrap text-lg text-slate-300 font-bold eading-[1.75] italic">
                {meta.desc}
              </div>
            </div>
          </div>
        </div>

        {/* Division Leaders */}
        <div className="max-w-content mx-auto px-4 my-6">
          <div className="text-[8px] text-danger tracking-[4px] uppercase mb-3 font-mono">
            DIVISION LEADERS
          </div>
          <div className="flex flex-col gap-2.5 mb-5">
            {leaders.map((agent, index) => (
              <StudentCard key={agent.id} agent={agent} delayMs={index * 60} />
            ))}
          </div>
        </div>

        {/* Senior Operatives */}

        <div className="max-w-content mx-auto px-4 my-6">
          <div className="text-[8px] text-danger tracking-[4px] uppercase mb-3 font-mono">
            SENIOR OPERATIVES
          </div>
          <div className="flex flex-col gap-2.5">
            {seniors.length > 0 ? (
              seniors.map((agent, index) => (
                <StudentCard
                  key={agent.id}
                  agent={agent}
                  delayMs={120 + index * 60}
                />
              ))
            ) : (
              <div className="bg-surface border border-dark/8 p-3.5 text-muted text-[13px] font-serif">
                No senior operatives on file yet.
              </div>
            )}
          </div>
        </div>

        {/* Junior Operatives */}
        <div className="max-w-content mx-auto px-4 my-6">
          <div className="text-[8px] text-muted-fg tracking-[4px] uppercase mb-3 font-mono">
            JUNIOR OPERATIVES
          </div>
          <div className="flex flex-col gap-2.5">
            {juniors.length > 0 ? (
              juniors.map((agent, index) => (
                <StudentCard
                  key={agent.id}
                  agent={agent}
                  delayMs={200 + index * 50}
                />
              ))
            ) : (
              <div className="bg-surface border border-dark/8 p-3.5 text-muted text-[13px] font-serif">
                No junior operatives on file yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
