"use client";

import { HOUSE_META } from "@/lib/constants/houses";
import { cn } from "@/lib/utils";
import type { HouseKey, Role } from "@/types";

type ProfileCardStudent = {
  id: string;
  displayName: string;
  nickname: string | null;
  profileUrl: string | null;
  role: Role;
  house: HouseKey;
  nationality: string | null;
  instagram: string | null;
  discord: string | null;
  line: string | null;
};

type ProfileCardProps = {
  student: ProfileCardStudent;
  onEdit?: () => void;
  className?: string;
};

const roleLabels: Record<Role, string> = {
  junior: "JUNIOR",
  senior: "SENIOR",
  house_leader: "HOUSE LEADER",
};

function formatName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name;
  return `${parts[0]}\n${parts.slice(1).join(" ")}`;
}

function ContactIcon({ type }: { type: "instagram" | "discord" | "line" }) {
  if (type === "instagram") {
    return (
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 3,
            border: "1.5px solid white",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        background: type === "discord" ? "#5865F2" : "#00B900",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: 700,
        fontFamily: "Arial, sans-serif",
        flexShrink: 0,
      }}
    >
      {type === "discord" ? "D" : "L"}
    </div>
  );
}

function ContactRow({
  type,
  label,
  value,
}: {
  type: "instagram" | "discord" | "line";
  label: string;
  value: string | null;
}) {
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
      <ContactIcon type={type} />
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
            color: "#1C1A17",
            overflowWrap: "anywhere",
          }}
        >
          {value?.trim() || "—"}
        </div>
      </div>
    </div>
  );
}

export function ProfileCard({ student, onEdit, className }: ProfileCardProps) {
  const houseMeta = HOUSE_META[student.house];
  const displayName = formatName(student.displayName);
  const alias = student.nickname?.trim() || "—";

  return (
    <section
      className={cn("profile-card", className)}
      style={{
        background: "#E5E0CF",
        borderBottom: "1px solid rgba(47,36,31,0.1)",
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
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
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 14,
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
              background: "rgba(168,106,42,0.08)",
              border: "1px solid rgba(168,106,42,0.35)",
              color: "#A86A2A",
              cursor: "pointer",
              fontSize: 9,
              letterSpacing: 2,
              padding: "5px 12px",
              fontFamily: "var(--font-special-elite), monospace",
            }}
          >
            EDIT FILE
          </button>
        )}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: 80,
              height: 96,
              background: "#F3EEE5",
              border: "2px solid rgba(168,106,42,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {student.profileUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={student.profileUrl}
                alt={`${student.displayName} profile photo`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
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
            <div style={{ position: "absolute", bottom: 3, right: 3, width: 8, height: 8, borderBottom: "1.5px solid rgba(168,106,42,0.45)", borderRight: "1.5px solid rgba(168,106,42,0.45)" }} />
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

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              fontFamily: "var(--font-cinzel-decorative), serif",
              fontSize: 17,
              color: "#1C1A17",
              lineHeight: 1.2,
              margin: "0 0 4px",
              whiteSpace: "pre-line",
            }}
          >
            {displayName}
          </h2>
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
                background: `${houseMeta.color}1A`,
                border: `1px solid ${houseMeta.color}4D`,
                fontSize: 8,
                color: houseMeta.color,
                letterSpacing: 1,
                fontFamily: "var(--font-special-elite), monospace",
              }}
            >
              {student.house.toUpperCase()}
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

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                fontSize: 9,
                color: "#A0907E",
                letterSpacing: 1,
                fontFamily: "var(--font-special-elite), monospace",
              }}
            >
              NATIONALITY:
            </div>
            <div style={{ fontSize: 12, color: "#2F241F" }}>
              {student.nationality?.trim() || "—"}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid rgba(47,36,31,0.1)",
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
          <ContactRow type="instagram" label="INSTAGRAM" value={student.instagram} />
          <ContactRow type="discord" label="DISCORD" value={student.discord} />
          <ContactRow type="line" label="LINE" value={student.line} />
        </div>
      </div>
    </section>
  );
}
