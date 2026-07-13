"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HintCard } from "@/components/hints/hint-card";
import { HOUSE_META } from "@/lib/constants/houses";
import type { Hint, PublicStudent } from "@/types";

export function HintsSection() {
  const [hints, setHints] = useState<Hint[]>([]);
  const [mentee, setMentee] = useState<PublicStudent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/hints").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ])
      .then(([hintsData, meData]) => {
        setHints(hintsData.hints ?? []);
        setMentee(meData.mentee ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px 0", textAlign: "center", fontSize: 9, color: "#A0907E", letterSpacing: 2, fontFamily: "'Special Elite', monospace" }}>
        LOADING...
      </div>
    );
  }

  const houseMeta = mentee ? HOUSE_META[mentee.house] : null;

  return (
    <div style={{ marginTop: 24, position: "relative", overflow: "hidden" }}>

      {/* Faint diagonal watermark — mirrors ProfileCard's CLASSIFIED pattern */}
      <div
        className="font-display"
        style={{
          position: "absolute",
          top: "45%",
          right: -12,
          transform: "translateY(-50%) rotate(-25deg)",
          fontSize: 32,
          color: "rgba(168,106,42,0.045)",
          letterSpacing: 8,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        EVIDENCE
      </div>

      {/* ── ASSIGNED CASE header ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 8, color: "#8b2020", letterSpacing: 4, fontFamily: "'Special Elite', monospace" }}>
            ASSIGNED CASE
          </div>
          {/* Rotated stamp — matches reference image stamp style */}
          <div style={{ border: "1.5px solid rgba(139,32,32,0.4)", padding: "2px 8px", transform: "rotate(-2deg)", display: "inline-block" }}>
            <div style={{ fontSize: 7, color: "#8b2020", letterSpacing: 2, fontFamily: "'Special Elite', monospace" }}>
              SENIOR ONLY
            </div>
          </div>
        </div>

        {mentee ? (
          <Link href={`/agent/${mentee.id}`} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#E5E0CF",
                border: "1px solid rgba(168,106,42,0.2)",
                padding: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Corner fold */}
              <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 14px 14px 0", borderColor: "transparent #F3EEE5 transparent transparent" }} />

              <div
                style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
                  background: "#F3EEE5", border: "1px solid rgba(168,106,42,0.25)",
                  backgroundImage: mentee.profileUrl ? `url("${mentee.profileUrl}")` : undefined,
                  backgroundSize: "cover", backgroundPosition: "center",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {!mentee.profileUrl && (
                  <span style={{ fontSize: 6, color: "#A0907E", textAlign: "center", fontFamily: "'Special Elite', monospace", lineHeight: 1.4 }}>
                    PHOTO
                  </span>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 8, color: "#A0907E", letterSpacing: 2, marginBottom: 2, fontFamily: "'Special Elite', monospace" }}>
                  YOUR JUNIOR OPERATIVE
                </div>
                <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 14, color: "#1C1A17", marginBottom: 4, lineHeight: 1.2 }}>
                  {mentee.displayName}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {houseMeta && (
                    <span style={{ padding: "2px 7px", background: `${houseMeta.color}1A`, border: `1px solid ${houseMeta.color}40`, fontSize: 7, color: houseMeta.color, letterSpacing: 1, fontFamily: "'Special Elite', monospace" }}>
                      {houseMeta.name.toUpperCase()}
                    </span>
                  )}
                  <span style={{ padding: "2px 7px", background: "rgba(168,106,42,0.1)", border: "1px solid rgba(168,106,42,0.25)", fontSize: 7, color: "#A86A2A", letterSpacing: 1, fontFamily: "'Special Elite', monospace" }}>
                    JUNIOR
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 18, color: "#C4B8A8", flexShrink: 0 }}>›</div>
            </div>
          </Link>
        ) : (
          <div
            style={{
              background: "#E5E0CF",
              border: "1px solid rgba(168,106,42,0.15)",
              padding: 14,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Corner fold */}
            <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 14px 14px 0", borderColor: "transparent #F3EEE5 transparent transparent" }} />

            <div style={{ fontSize: 8, color: "#A0907E", letterSpacing: 2, marginBottom: 6, fontFamily: "'Special Elite', monospace" }}>
              YOUR JUNIOR OPERATIVE
            </div>
            <div style={{ fontSize: 11, color: "#C4B8A8", letterSpacing: 1, fontFamily: "'Special Elite', monospace" }}>
              NO MENTEE ASSIGNED
            </div>

            {/* Faint NO MENTEE stamp */}
            <div
              style={{
                position: "absolute",
                bottom: 10,
                right: 14,
                border: "1.5px solid rgba(47,36,31,0.12)",
                padding: "2px 7px",
                transform: "rotate(-3deg)",
              }}
            >
              <span style={{ fontSize: 7, color: "rgba(47,36,31,0.25)", letterSpacing: 2, fontFamily: "'Special Elite', monospace" }}>
                UNASSIGNED
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Section divider ── */}
      {hints.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(47,36,31,0.1)" }} />
          <div style={{ fontSize: 8, color: "#A0907E", letterSpacing: 3, fontFamily: "'Special Elite', monospace", whiteSpace: "nowrap" }}>
            EVIDENCE HINTS
          </div>
          <div style={{ flex: 1, height: 1, background: "rgba(47,36,31,0.1)" }} />
        </div>
      )}

      {/* ── Hint cards ── */}
      {hints.length > 0 && (
        <div>
          {hints.map((hint, i) => (
            <HintCard key={hint.id} hint={hint} index={i + 1} variant="senior" />
          ))}
        </div>
      )}
    </div>
  );
}
