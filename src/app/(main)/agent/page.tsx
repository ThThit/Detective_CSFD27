"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/components/profile/profile-card";
import type { MeResponse } from "@/types";

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

function toProfileStudent(user: MeResponse) {
  return {
    id: user.id,
    studentId: user.studentId,
    role: user.role,
    displayName: user.displayName,
    nickname: user.nickname,
    profileUrl: user.profileUrl,
    house: user.house,
    instagram: user.instagram,
    discord: user.discord,
    line: user.line,
    nationality: user.nationality,
  };
}

export default function AgentPage() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const me: MeResponse = await res.json();
        if (!ignore) setUser(me);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [router]);

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
        <button
          type="button"
          aria-label="Edit file placeholder"
          style={{
            padding: "5px 12px",
            border: "1px solid rgba(168,106,42,0.35)",
            background: "rgba(168,106,42,0.08)",
            fontSize: 9,
            color: "#A86A2A",
            letterSpacing: 2,
            cursor: "default",
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          EDIT FILE
        </button>
      </header>

      <main style={{ flex: 1, overflowY: "auto" }}>
        {loading && (
          <div
            style={{
              margin: 16,
              background: "#E5E0CF",
              border: "1px solid rgba(47,36,31,0.08)",
              padding: 20,
              color: "#7A6A58",
              fontSize: 13,
              letterSpacing: 2,
              fontFamily: "var(--font-special-elite), monospace",
            }}
          >
            RETRIEVING AGENT DOSSIER...
          </div>
        )}

        {!loading && user && <ProfileCard student={toProfileStudent(user)} />}

        {/* === DEV 4: Edit mode controls (senior/junior shared) === */}

        {/* === DEV 5: Mentee & Hints section — seniors/house_leaders only === */}

        {/* === DEV 6: Accusation terminal — juniors only === */}
      </main>

      <BottomTabs />
    </div>
  );
}
