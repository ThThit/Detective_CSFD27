"use client";

import { HOUSE_META } from "@/lib/constants/houses";
import type { PublicStudent } from "@/types";

type ProfileCardStudent = Pick<
  PublicStudent,
  | "id"
  | "studentId"
  | "role"
  | "displayName"
  | "nickname"
  | "profileUrl"
  | "house"
  | "instagram"
  | "discord"
  | "line"
  | "nationality"
>;

type ProfileCardProps = {
  student: ProfileCardStudent;
  onEdit?: () => void;
};

const roleLabels: Record<ProfileCardStudent["role"], string> = {
  junior: "JUNIOR",
  senior: "SENIOR",
  house_leader: "HOUSE LEADER",
};

function ContactRow({
  label,
  value,
  icon,
  background,
}: {
  label: string;
  value: string | null;
  icon: string;
  background: string;
}) {
  const displayValue = value?.trim() || "—";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#F3EEE5",
        border: "1px solid rgba(47,36,31,0.1)",
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "Arial, sans-serif",
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 8,
            color: "#A0907E",
            letterSpacing: 1,
            marginBottom: 2,
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 14,
            color: displayValue === "—" ? "#A0907E" : "#1C1A17",
            overflowWrap: "anywhere",
          }}
        >
          {displayValue}
        </div>
      </div>
    </div>
  );
}

function ProfilePhoto({ student }: { student: ProfileCardStudent }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: 80,
          height: 96,
          backgroundColor: "#F3EEE5",
          backgroundImage: student.profileUrl ? `url("${student.profileUrl}")` : undefined,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          border: "2px solid rgba(168,106,42,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!student.profileUrl && (
          <div
            style={{
              fontSize: 8,
              color: "#A0907E",
              textAlign: "center",
              lineHeight: 1.4,
              fontFamily: "var(--font-special-elite), monospace",
            }}
          >
            PROFILE
            <br />
            PHOTO
          </div>
        )}
        <div style={{ position: "absolute", top: 3, left: 3, width: 8, height: 8, borderTop: "1.5px solid rgba(168,106,42,0.45)", borderLeft: "1.5px solid rgba(168,106,42,0.45)" }} />
        <div style={{ position: "absolute", top: 3, right: 3, width: 8, height: 8, borderTop: "1.5px solid rgba(168,106,42,0.45)", borderRight: "1.5px solid rgba(168,106,42,0.45)" }} />
        <div style={{ position: "absolute", bottom: 3, left: 3, width: 8, height: 8, borderBottom: "1.5px solid rgba(168,106,42,0.45)", borderLeft: "1.5px solid rgba(168,106,42,0.45)" }} />
        <div style={{ position: "absolute", right: 3, bottom: 3, width: 8, height: 8, borderRight: "1.5px solid rgba(168,106,42,0.45)", borderBottom: "1.5px solid rgba(168,106,42,0.45)" }} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#3a6a2a",
          padding: "2px 6px",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            fontSize: 6,
            color: "#d0f0c0",
            letterSpacing: 2,
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          VERIFIED
        </div>
      </div>
    </div>
  );
}

export function ProfileCard({ student, onEdit }: ProfileCardProps) {
  const house = HOUSE_META[student.house];
  const alias = student.nickname?.trim() || "—";
  const nationality = student.nationality?.trim() || "Nationality undisclosed";

  return (
    <section
      style={{
        background: "#E5E0CF",
        borderBottom: "1px solid rgba(47,36,31,0.1)",
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: -20,
          transform: "translateY(-50%) rotate(-35deg)",
          fontFamily: "var(--font-cinzel-decorative), serif",
          fontSize: 40,
          color: "rgba(168,106,42,0.05)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          letterSpacing: 4,
        }}
      >
        CLASSIFIED
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 7,
            color: "#8b2020",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          AGENT DOSSIER · READ ONLY
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            style={{
              border: "1px solid rgba(168,106,42,0.35)",
              background: "rgba(168,106,42,0.08)",
              color: "#A86A2A",
              cursor: "pointer",
              padding: "5px 10px",
              fontSize: 8,
              letterSpacing: 2,
              fontFamily: "var(--font-special-elite), monospace",
            }}
          >
            EDIT FILE
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", position: "relative" }}>
        <ProfilePhoto student={student} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontFamily: "var(--font-cinzel-decorative), serif",
              fontSize: 17,
              color: "#1C1A17",
              lineHeight: 1.2,
              margin: "0 0 4px",
              overflowWrap: "anywhere",
            }}
          >
            {student.displayName}
          </h1>
          <div
            style={{
              fontSize: 13,
              color: "#A86A2A",
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            Alias: <strong>{alias}</strong>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            <div
              style={{
                padding: "3px 8px",
                background: `${house.color}1A`,
                border: `1px solid ${house.color}4D`,
                fontSize: 8,
                color: house.color,
                letterSpacing: 1,
                fontFamily: "var(--font-special-elite), monospace",
              }}
            >
              {house.name.toUpperCase()}
            </div>
            <div
              style={{
                padding: "3px 8px",
                background: "rgba(139,32,32,0.08)",
                border: "1px solid rgba(139,32,32,0.25)",
                fontSize: 8,
                color: "#8b2020",
                letterSpacing: 1,
                fontFamily: "var(--font-special-elite), monospace",
              }}
            >
              {roleLabels[student.role]}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#7A6A58", letterSpacing: 1 }}>
            {nationality}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          paddingTop: 16,
          borderTop: "1px solid rgba(47,36,31,0.08)",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 8,
            color: "#A0907E",
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 12,
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          CONTACT CHANNELS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ContactRow
            label="INSTAGRAM"
            value={student.instagram}
            icon="I"
            background="linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
          />
          <ContactRow label="DISCORD" value={student.discord} icon="D" background="#5865F2" />
          <ContactRow label="LINE" value={student.line} icon="L" background="#00B900" />
        </div>
      </div>
    </section>
  );
}
