import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { student } from "@/db/schema";
import { ProfileCard } from "@/components/profile/profile-card";
import { toPublicStudent } from "@/lib/mappers";

type AgentProfilePageProps = {
  params: Promise<{ id: string }>;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function BottomTabs() {
  return (
    <nav
      style={{
        display: "flex",
        background: "#E5E0CF",
        borderTop: "1px solid rgba(47,36,31,0.1)",
        flexShrink: 0,
        paddingBottom: 34,
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
    </nav>
  );
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { id } = await params;

  if (!uuidPattern.test(id)) {
    notFound();
  }

  const [row] = await db
    .select()
    .from(student)
    .where(and(eq(student.id, id), isNull(student.deletedAt)))
    .limit(1);

  if (!row) {
    notFound();
  }

  const publicStudent = toPublicStudent(row);
  const caseNumber = `#2027-CSFD-${publicStudent.house.toUpperCase().slice(0, 3)}-${publicStudent.studentId.slice(-3)}`;

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
      <header
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
          <Link
            href="/houses"
            aria-label="Back to houses"
            style={{
              fontSize: 18,
              color: "#A0907E",
              textDecoration: "none",
              lineHeight: 1,
              paddingRight: 4,
            }}
          >
            ‹
          </Link>
          <Link
            href="/houses"
            style={{
              fontFamily: "var(--font-cinzel-decorative), serif",
              fontSize: 15,
              color: "#2F241F",
              letterSpacing: 1,
              textDecoration: "none",
            }}
          >
            CSFD27
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, overflowY: "auto" }}>
        <ProfileCard student={publicStudent} />

        <div
          style={{
            margin: 16,
            background: "#E5E0CF",
            border: "1px solid rgba(139,32,32,0.15)",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ width: 5, height: 5, background: "#8b2020", borderRadius: "50%", flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "#7A6A58", lineHeight: 1.5 }}>
            This is a read-only dossier. To edit your own profile, navigate to{" "}
            <Link href="/agent" style={{ color: "#A86A2A", textDecoration: "none" }}>
              /agent
            </Link>
            .
          </div>
        </div>

        <div
          style={{
            margin: "0 16px 32px",
            background: "#E5E0CF",
            border: "1px solid rgba(47,36,31,0.08)",
            padding: 20,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%) rotate(-5deg)",
              fontFamily: "var(--font-cinzel-decorative), serif",
              fontSize: 30,
              color: "rgba(168,106,42,0.05)",
              whiteSpace: "nowrap",
              letterSpacing: 4,
              pointerEvents: "none",
            }}
          >
            ON FILE
          </div>
          <div
            style={{
              fontSize: 8,
              color: "#A0907E",
              letterSpacing: 3,
              marginBottom: 6,
              fontFamily: "var(--font-special-elite), monospace",
              position: "relative",
            }}
          >
            CASE FILE REFERENCE
          </div>
          <div
            style={{
              fontFamily: "var(--font-special-elite), monospace",
              fontSize: 13,
              color: "#7A6A58",
              letterSpacing: 2,
              position: "relative",
            }}
          >
            {caseNumber}
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 8,
              color: "#C4B8A8",
              letterSpacing: 1,
              fontFamily: "var(--font-special-elite), monospace",
              position: "relative",
            }}
          >
            ISSUED BY CS DEPARTMENT · CONFIDENTIAL
          </div>
        </div>
      </main>

      <BottomTabs />
    </div>
  );
}
