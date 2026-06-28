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
      className={cn("block", className)}
      style={{
        background: "#E5E0CF",
        border: "1px solid rgba(47,36,31,0.1)",
        padding: 12,
        textDecoration: "none",
        color: "inherit",
        animation: `fadeIn 0.4s ease-out ${delayMs}ms both`,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#F3EEE5",
          border: `1px solid rgba(${r},${g},${b},0.2)`,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {student.profileUrl ? (
          <Image
            src={student.profileUrl}
            alt={`${student.displayName} profile`}
            width={36}
            height={36}
            unoptimized
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              fontSize: 6,
              color: "#A0907E",
              fontFamily: "var(--font-special-elite), monospace",
              letterSpacing: 1,
            }}
          >
            PHOTO
          </div>
        )}
      </div>

      <div
        style={{
          fontFamily: "var(--font-cinzel-decorative), serif",
          fontSize: 11,
          color: "#1C1A17",
          lineHeight: 1.2,
          marginBottom: 2,
        }}
      >
        {student.displayName}
      </div>

      <div
        style={{
          fontSize: 11,
          color: "#7A6A58",
          marginBottom: 6,
          fontStyle: "italic",
          fontFamily: "var(--font-cormorant-garamond), serif",
        }}
      >
        {student.nickname ?? "Alias pending"}
      </div>

      <div
        style={{
          display: "inline-block",
          padding: "2px 6px",
          background: `rgba(${r},${g},${b},0.1)`,
          border: `1px solid rgba(${r},${g},${b},0.2)`,
        }}
      >
        <div
          style={{
            fontSize: 7,
            color: meta.color,
            letterSpacing: 1,
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          {ROLE_LABELS[student.role]}
        </div>
      </div>
    </Link>
  );
}
