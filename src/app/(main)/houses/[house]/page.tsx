import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { student } from "@/db/schema";
import { HOUSE_META, HOUSES, type House } from "@/lib/constants/houses";
import { toPublicStudent } from "@/lib/mappers";
import { AgentCard } from "@/components/house/AgentCard";
import type { PublicStudent } from "@/types";

const ROLE_LABELS: Record<PublicStudent["role"], string> = {
  house_leader: "HOUSE LEADER",
  senior: "SENIOR",
  junior: "JUNIOR",
};

function isHouse(value: string): value is House {
  return (HOUSES as readonly string[]).includes(value);
}

function HouseEmblem({ house }: { house: House }) {
  const color = "rgba(243,238,229,0.82)";

  switch (house) {
    case "tracer":
      return <div style={{ width: 22, height: 22, borderRadius: "50%", background: color }} />;
    case "noir":
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderBottom: `24px solid ${color}`,
          }}
        />
      );
    case "foxlock":
      return (
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: `3px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        </div>
      );
    case "cipher":
      return (
        <div style={{ position: "relative", width: 24, height: 30 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 14,
              height: 13,
              border: `3px solid ${color}`,
              borderBottom: "none",
              borderRadius: "8px 8px 0 0",
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 24,
              height: 19,
              border: `3px solid ${color}`,
              boxSizing: "border-box",
            }}
          />
        </div>
      );
  }
}

function SeniorCard({ agent, delayMs = 0 }: { agent: PublicStudent; delayMs?: number }) {
  const meta = HOUSE_META[agent.house];
  const [r, g, b] = meta.rgb;
  const isLeader = agent.role === "house_leader";

  return (
    <Link
      href={`/agent/${agent.id}`}
      style={{
        background: "#E5E0CF",
        border: `1px solid rgba(${r},${g},${b},0.2)`,
        borderLeft: isLeader ? `4px solid ${meta.color}` : `1px solid rgba(${r},${g},${b},0.2)`,
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
        textDecoration: "none",
        color: "inherit",
        animation: `fadeIn 0.4s ease-out ${delayMs}ms both`,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#F3EEE5",
          border: `2px solid rgba(${r},${g},${b},0.3)`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {agent.profileUrl ? (
          <Image
            src={agent.profileUrl}
            alt={`${agent.displayName} profile`}
            width={48}
            height={48}
            unoptimized
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              fontSize: 7,
              color: "#A0907E",
              textAlign: "center",
              lineHeight: 1.3,
              fontFamily: "var(--font-special-elite), monospace",
              letterSpacing: 1,
            }}
          >
            PHOTO
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-cinzel-decorative), serif",
            fontSize: 13,
            color: "#1C1A17",
            marginBottom: 2,
            lineHeight: 1.3,
          }}
        >
          {agent.displayName}
        </div>
        <div style={{ fontSize: 12, color: "#7A6A58", marginBottom: 6 }}>
          Alias: <span style={{ color: meta.color, fontWeight: 600 }}>{agent.nickname ?? "Pending"}</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <div
            style={{
              padding: "2px 7px",
              background: `rgba(${r},${g},${b},0.12)`,
              border: `1px solid rgba(${r},${g},${b},0.25)`,
              fontSize: 7,
              color: meta.color,
              letterSpacing: 1,
              fontFamily: "var(--font-special-elite), monospace",
            }}
          >
            {ROLE_LABELS[agent.role]}
          </div>
          {isLeader && (
            <div
              style={{
                padding: "2px 7px",
                background: "rgba(139,32,32,0.1)",
                border: "1px solid rgba(139,32,32,0.25)",
                fontSize: 7,
                color: "#8b2020",
                letterSpacing: 1,
                fontFamily: "var(--font-special-elite), monospace",
              }}
            >
              LEAD
            </div>
          )}
        </div>
      </div>

      <div style={{ fontSize: 18, color: "#C4B8A8" }}>{">"}</div>
    </Link>
  );
}

function BottomTabs() {
  return (
    <div
      style={{
        display: "flex",
        background: "#E5E0CF",
        borderTop: "1px solid rgba(47,36,31,0.1)",
        flexShrink: 0,
      }}
    >
      <Link
        href="/houses"
        style={{
          flex: 1,
          padding: "9px 0 10px",
          textAlign: "center",
          textDecoration: "none",
          borderRight: "1px solid rgba(47,36,31,0.06)",
          display: "block",
        }}
      >
        <div style={{ width: 14, height: 1.5, background: "#A86A2A", margin: "0 auto 4px" }} />
        <div
          style={{
            fontSize: 7,
            color: "#A86A2A",
            letterSpacing: 1.5,
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          DIVISIONS
        </div>
      </Link>
      <Link
        href="/agent"
        style={{
          flex: 1,
          padding: "9px 0 10px",
          textAlign: "center",
          textDecoration: "none",
          borderRight: "1px solid rgba(47,36,31,0.06)",
          opacity: 0.4,
          display: "block",
        }}
      >
        <div
          style={{
            fontSize: 7,
            color: "#7A6A58",
            letterSpacing: 1.5,
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          AGENT
        </div>
      </Link>
      <Link
        href="/admin/dashboard"
        style={{
          flex: 1,
          padding: "9px 0 10px",
          textAlign: "center",
          textDecoration: "none",
          opacity: 0.4,
          display: "block",
        }}
      >
        <div
          style={{
            fontSize: 7,
            color: "#7A6A58",
            letterSpacing: 1.5,
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          STATS
        </div>
      </Link>
    </div>
  );
}

export default async function HousePage({ params }: { params: Promise<{ house: string }> }) {
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
      asc(student.displayName)
    );

  const members = rows.map(toPublicStudent);
  const seniors = members.filter((member) => member.role === "house_leader" || member.role === "senior");
  const juniors = members.filter((member) => member.role === "junior");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3EEE5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-cormorant-garamond), serif",
      }}
    >
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(47,36,31,0.14)",
          flexShrink: 0,
          background: "#E5E0CF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/houses" style={{ fontSize: 16, color: "#A0907E", textDecoration: "none", lineHeight: 1 }}>
            {"<"}
          </Link>
          <div
            style={{
              fontFamily: "var(--font-cinzel-decorative), serif",
              fontSize: 15,
              color: "#2F241F",
              letterSpacing: 1,
            }}
          >
            CSFD27
          </div>
        </div>
        <div
          style={{
            padding: "4px 10px",
            border: `1px solid rgba(${r},${g},${b},0.3)`,
            background: `rgba(${r},${g},${b},0.08)`,
            fontSize: 9,
            color: meta.color,
            letterSpacing: 2,
            fontFamily: "var(--font-special-elite), monospace",
            textTransform: "uppercase",
          }}
        >
          {meta.name}
        </div>
      </div>

      <main style={{ flex: 1, overflowY: "auto" }}>
        <div
          style={{
            background: meta.color,
            borderBottom: `3px solid rgba(243,238,229,0.35)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(243,238,229,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(243,238,229,0.04) 1px,transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg,rgba(243,238,229,0.06),transparent 60%)",
            }}
          />
          <div style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: "24px 20px 20px" }}>
            <div
              style={{
                display: "inline-block",
                border: "1.5px solid rgba(243,238,229,0.25)",
                padding: "2px 8px",
                marginBottom: 14,
                animation: "stampIn 0.7s ease-out both",
              }}
            >
              <div
                style={{
                  fontSize: 7,
                  color: "rgba(243,238,229,0.5)",
                  letterSpacing: 3,
                  fontFamily: "var(--font-special-elite), monospace",
                }}
              >
                DIVISION DOSSIER
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  border: "2px solid rgba(243,238,229,0.25)",
                  background: "rgba(243,238,229,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <HouseEmblem house={house} />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-cinzel-decorative), serif",
                    fontSize: 22,
                    color: "#F3EEE5",
                    lineHeight: 1.15,
                    marginBottom: 6,
                  }}
                >
                  {meta.name} - {meta.tagline}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(243,238,229,0.65)",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                    marginBottom: 10,
                  }}
                >
                  Operatives assigned to the {meta.name} division.
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <div
                    style={{
                      padding: "3px 8px",
                      background: "rgba(243,238,229,0.12)",
                      border: "1px solid rgba(243,238,229,0.25)",
                      fontSize: 8,
                      color: "rgba(243,238,229,0.8)",
                      letterSpacing: 1,
                      fontFamily: "var(--font-special-elite), monospace",
                    }}
                  >
                    {members.length} AGENTS
                  </div>
                  <div
                    style={{
                      padding: "3px 8px",
                      background: "rgba(58,106,42,0.25)",
                      border: "1px solid rgba(58,106,42,0.45)",
                      fontSize: 8,
                      color: "#8aca80",
                      letterSpacing: 1,
                      fontFamily: "var(--font-special-elite), monospace",
                    }}
                  >
                    ACTIVE
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(243,238,229,0.12)" }}>
              <div style={{ fontSize: 14, color: "rgba(243,238,229,0.55)", lineHeight: 1.75, fontStyle: "italic" }}>
                {meta.desc}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 16px 0" }}>
          <div
            style={{
              fontSize: 8,
              color: "#8b2020",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 12,
              fontFamily: "var(--font-special-elite), monospace",
            }}
          >
            SENIOR OPERATIVES
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {seniors.length > 0 ? (
              seniors.map((agent, index) => <SeniorCard key={agent.id} agent={agent} delayMs={index * 60} />)
            ) : (
              <div style={{ background: "#E5E0CF", border: "1px solid rgba(47,36,31,0.08)", padding: 14, color: "#7A6A58" }}>
                No senior operatives on file yet.
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 28px" }}>
          <div
            style={{
              fontSize: 8,
              color: "#A0907E",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 12,
              fontFamily: "var(--font-special-elite), monospace",
            }}
          >
            OPERATIVES
          </div>
          {juniors.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
              {juniors.map((agent, index) => (
                <AgentCard key={agent.id} student={agent} delayMs={100 + index * 50} />
              ))}
            </div>
          ) : (
            <div style={{ background: "#E5E0CF", border: "1px solid rgba(47,36,31,0.08)", padding: 14, color: "#7A6A58" }}>
              No junior operatives on file yet.
            </div>
          )}
        </div>
      </main>

      <BottomTabs />
    </div>
  );
}
