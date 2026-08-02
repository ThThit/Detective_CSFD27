import { HOUSE_META } from "@/lib/constants/houses";
import type { Hint, MenteeCase } from "@/types";
import { FileItem } from "../house/FileItem";
import { InkStamp } from "@/components/ui/InkStamp";
import { HintCardInline } from "../agent/AccusationTerminal";

type Props = {
  hints: Hint[];
  cases: MenteeCase[];
};

export function HintsSection({ hints, cases }: Props) {
  return (
    <div className="mt-8">
      {/* ── ASSIGNED CASE(S) ── */}
      <div className="mb-8">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="text-[12px] min-[440px]:text-[10px] tracking-[3px] text-[#8b2020] [font-family:'Special_Elite',monospace]">
            {cases.length > 1 ? "ASSIGNED CASES" : "ASSIGNED CASE"}
          </div>
          <div className="grid -rotate-3 place-items-center border border-[rgba(139,32,32,0.4)] px-2 py-1.5">
            <span className="text-[12px] min-[440px]:text-[10px] leading-none tracking-[2px] text-[rgba(139,32,32,0.6)] [font-family:'Special_Elite',monospace]">
              SENIOR ONLY
            </span>
          </div>
        </div>

        {cases.length > 0 ? (
          <div className="flex flex-col gap-4">
            {cases.map(({ mentee, isFound }, index) => {
              const houseMeta = HOUSE_META[mentee.house];
              const isLeader = mentee.role === "house_leader";
              const isSenior = mentee.role === "senior";
              const code =
                (isLeader ? "LDR" : isSenior ? "SR" : "JR") +
                "-" +
                mentee.studentId.slice(-2);
              const isFailed = !isFound && mentee.guessLeft <= 0;
              const statusColor = isFound
                ? "#3a6a2a"
                : isFailed
                  ? "#2F241F"
                  : "#8b2020";
              const statusLabel = isFound
                ? "Solved"
                : isFailed
                  ? "Failed"
                  : "Open";

              return (
                <FileItem
                  key={mentee.id}
                  href={`/agent/${mentee.id}`}
                  color={houseMeta.color}
                  index={index}
                  badgeLabel={code}
                  hideBadge
                  beforeBadge={
                    <InkStamp
                      rotate={-8}
                      style={{
                        fontSize: 8,
                        padding: "2px 6px",
                        letterSpacing: 1.5,
                        border: `2.5px solid ${statusColor}`,
                        color: statusColor,
                        opacity: 0.85,
                      }}
                    >
                      {statusLabel}
                    </InkStamp>
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden border border-[rgba(47,36,31,0.15)] bg-[#D6CEBF] bg-cover bg-center"
                      style={{
                        backgroundImage: `url("${mentee.profileUrl ?? "/detective-conan-pfp.png"}")`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-sm leading-[1.3] text-[#1C1A17] [font-family:'Cinzel_Decorative',serif]">
                        {mentee.displayName}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {houseMeta && (
                          <span
                            className="px-1.5 py-0.5 text-[12px] min-[440px]:text-[10px] tracking-[1px] [font-family:'Special_Elite',monospace]"
                            style={{
                              border: `1px solid ${houseMeta.color}4D`,
                              color: houseMeta.color,
                              background: `${houseMeta.color}1A`,
                            }}
                          >
                            {houseMeta.name.toUpperCase()}
                          </span>
                        )}
                        <span className="border border-[rgba(139,32,32,0.25)] bg-[rgba(139,32,32,0.06)] px-1.5 py-0.5 text-[12px] min-[440px]:text-[10px] tracking-[1px] text-[#8b2020] [font-family:'Special_Elite',monospace]">
                          JUNIOR
                        </span>
                      </div>
                    </div>
                  </div>
                </FileItem>
              );
            })}
          </div>
        ) : (
          <div className="border border-[rgba(47,36,31,0.1)] bg-[#E5E0CF] px-3.5 py-4 text-center text-[13px] min-[440px]:text-[11px] tracking-[1px] text-[#A0907E] [font-family:'Special_Elite',monospace]">
            NO MENTEE ASSIGNED
          </div>
        )}
      </div>

      {/* ── EVIDENCE HINTS ── */}
      {hints.length > 0 && (
        <div>
          <div className="mb-2.5 text-[12px] min-[440px]:text-[10px] tracking-[3px] text-[#8b2020] [font-family:'Special_Elite',monospace]">
            EVIDENCE HINTS
          </div>
          {cases.length > 1
            ? cases.map(({ pcodeId, mentee }) => {
                const caseHints = hints.filter((h) => h.pcodeId === pcodeId);
                if (caseHints.length === 0) return null;
                return (
                  <div key={pcodeId} className="mb-8">
                    <div className="mb-1.5 text-[12px] min-[440px]:text-[10px] tracking-[1px] text-[#A0907E] [font-family:'Special_Elite',monospace]">
                      RE: {mentee.displayName.toUpperCase()}
                    </div>
                    {caseHints.map((hint, i) => (
                      <HintCardInline
                        key={hint.id}
                        hint={hint}
                        index={i + 1}
                        // variant="senior"
                      />
                    ))}
                  </div>
                );
              })
            : hints.map((hint, i) => (
                <HintCardInline
                  key={hint.id}
                  hint={hint}
                  index={i + 1}
                  // variant="senior"
                />
              ))}
        </div>
      )}
    </div>
  );
}
