import Link from "next/link";
import Image from "next/image";
import { HOUSE_META } from "@/lib/constants/houses";
import { cn } from "@/lib/utils";
import type { HouseKey, Role } from "@/types";

type AgentCardProps = {
  student: {
    id: string;
    displayName: string;
    nickname: string | null;
    profileUrl: string | null;
    role: Role;
    house: HouseKey;
  };
  className?: string;
  delayMs?: number;
};

const ROLE_LABELS: Record<Role, string> = {
  house_leader: "HOUSE LEADER",
  senior: "SENIOR",
  junior: "JUNIOR",
};

export function AgentCard({ student, className, delayMs = 0 }: AgentCardProps) {
  const meta = HOUSE_META[student.house];
  const [r, g, b] = meta.rgb;

  return (
    <Link
      href={`/agent/${student.id}`}
      className={cn("agent-card block no-underline text-inherit p-3 bg-surface border border-dark/10", className)}
      style={{ animation: `fadeIn 0.4s ease-out ${delayMs}ms both` }}
    >
      <div
        className="w-9 h-9 rounded-full mb-2 flex items-center justify-center overflow-hidden shrink-0 bg-background"
        style={{ border: `1px solid rgba(${r},${g},${b},0.2)` }}
      >
        {student.profileUrl ? (
          <Image
            src={student.profileUrl}
            alt={`${student.displayName} profile`}
            width={36}
            height={36}
            unoptimized
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-[6px] text-muted-fg font-mono tracking-[1px]">PHOTO</div>
        )}
      </div>

      <div className="font-display text-[11px] text-foreground leading-tight mb-0.5">
        {student.displayName}
      </div>

      <div className="text-[11px] text-muted italic font-serif mb-1.5">
        {student.nickname ?? "Alias pending"}
      </div>

      <div
        className="inline-block px-1.5 py-0.5"
        style={{
          background: `rgba(${r},${g},${b},0.1)`,
          border: `1px solid rgba(${r},${g},${b},0.2)`,
        }}
      >
        <div className="text-[7px] tracking-[1px] font-mono" style={{ color: meta.color }}>
          {ROLE_LABELS[student.role]}
        </div>
      </div>
    </Link>
  );
}
