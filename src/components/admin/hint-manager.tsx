"use client";

import { useState } from "react";

type HintManagerProps = {
  pairs: Array<{
    seniorCode: string;
    juniorCode: string;
    hints: Array<{ content: string; revealDate: string }>;
  }>;
};

type FilterTab = "ALL" | "MISSING" | "COMPLETE";

function formatDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

function getGlobalDate(pairs: HintManagerProps["pairs"], pos: number): string | null {
  for (const pair of pairs) {
    if (pair.hints[pos]) return pair.hints[pos].revealDate;
  }
  return null;
}

type SlotStatus = "RELEASED" | "PENDING" | "SCHEDULED";

function getSlotStatus(
  revealDate: string | null,
  pairs: HintManagerProps["pairs"],
  pos: number
): SlotStatus {
  if (!revealDate) return "SCHEDULED";
  if (new Date(revealDate) <= new Date()) return "RELEASED";
  const hasContent = pairs.some((p) => p.hints[pos]?.content.trim());
  return hasContent ? "PENDING" : "SCHEDULED";
}

export function HintManager({ pairs }: HintManagerProps) {
  const [filter, setFilter] = useState<FilterTab>("ALL");

  const globalDates = [0, 1, 2].map((i) => getGlobalDate(pairs, i));
  const globalStatuses = globalDates.map((date, i) => getSlotStatus(date, pairs, i));

  const filtered = pairs.filter((pair) => {
    const allSet = pair.hints.length >= 3 && pair.hints.every((h) => h.content.trim());
    const anyMissing = pair.hints.length < 3 || pair.hints.some((h) => !h.content.trim());
    if (filter === "COMPLETE") return allSet;
    if (filter === "MISSING") return anyMissing;
    return true;
  });

  const statusColor: Record<SlotStatus, string> = {
    RELEASED: "#3a6a2a",
    PENDING: "#A86A2A",
    SCHEDULED: "#A0907E",
  };

  return (
    <div style={{ background: "#F3EEE5", fontFamily: "'Special Elite', monospace" }}>

      {/* ── Global release schedule ── */}
      <div style={{ background: "#E5E0CF", border: "1px solid rgba(47,36,31,0.12)", marginBottom: 16, padding: 16 }}>
        <div style={{ fontSize: 8, color: "#A0907E", letterSpacing: 3, marginBottom: 12 }}>
          GLOBAL RELEASE SCHEDULE
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {[0, 1, 2].map((i) => {
            const date = globalDates[i];
            const status = globalStatuses[i];
            const color = statusColor[status];
            const isReleased = status === "RELEASED";
            const isPending = status === "PENDING";
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  border: `1px solid ${isReleased ? "rgba(58,106,42,0.25)" : isPending ? "rgba(168,106,42,0.25)" : "rgba(47,36,31,0.1)"}`,
                  padding: "10px 12px",
                  opacity: status === "SCHEDULED" ? 0.65 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  {isPending ? (
                    <div
                      className="animate-pulse"
                      style={{ width: 5, height: 5, background: color, borderRadius: "50%", flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: 5, height: 5, background: color, borderRadius: "50%", flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: 8, color, letterSpacing: 2 }}>HINT {i + 1}</span>
                </div>
                <div style={{ fontSize: 10, color: "#2F241F", marginBottom: 6 }}>
                  {date ? formatDate(date) : "—"}
                </div>
                <div style={{ fontSize: 8, color, letterSpacing: 1, marginBottom: isReleased ? 0 : 8 }}>
                  {status}
                </div>
                {!isReleased && (
                  <button
                    type="button"
                    style={{
                      padding: "3px 8px",
                      border: "1px solid rgba(139,32,32,0.35)",
                      background: "rgba(139,32,32,0.06)",
                      color: "#8b2020",
                      fontSize: 8,
                      letterSpacing: 1,
                      cursor: "pointer",
                      fontFamily: "'Special Elite', monospace",
                    }}
                  >
                    RELEASE NOW
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ display: "flex", gap: 1, marginBottom: 12 }}>
        {(["ALL", "MISSING", "COMPLETE"] as FilterTab[]).map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              style={{
                padding: "5px 14px",
                border: `1px solid ${active ? "rgba(168,106,42,0.4)" : "rgba(47,36,31,0.12)"}`,
                background: active ? "rgba(168,106,42,0.1)" : "transparent",
                color: active ? "#A86A2A" : "#A0907E",
                fontSize: 8,
                letterSpacing: 2,
                cursor: "pointer",
                fontFamily: "'Special Elite', monospace",
              }}
            >
              {tab}
            </button>
          );
        })}
        <span style={{ marginLeft: "auto", fontSize: 9, color: "#A0907E", alignSelf: "center" }}>
          {filtered.length} PAIR{filtered.length !== 1 ? "S" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div style={{ border: "1px solid rgba(47,36,31,0.12)", overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 60px 60px 60px",
            padding: "8px 12px",
            background: "#E5E0CF",
            borderBottom: "1px solid rgba(47,36,31,0.12)",
            gap: 8,
          }}
        >
          {["SENIOR", "JUNIOR", "HINT 1", "HINT 2", "HINT 3"].map((col) => (
            <div key={col} style={{ fontSize: 7, color: "#A0907E", letterSpacing: 2 }}>
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "24px 12px", textAlign: "center", fontSize: 9, color: "#A0907E", letterSpacing: 1 }}>
            NO PAIRS MATCH FILTER
          </div>
        ) : (
          filtered.map((pair, rowIdx) => (
            <div
              key={`${pair.seniorCode}-${pair.juniorCode}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 60px 60px 60px",
                padding: "10px 12px",
                gap: 8,
                borderBottom:
                  rowIdx < filtered.length - 1 ? "1px solid rgba(47,36,31,0.06)" : "none",
                background: rowIdx % 2 === 0 ? "#F3EEE5" : "rgba(47,36,31,0.02)",
              }}
            >
              <div style={{ fontSize: 11, color: "#1C1A17" }}>{pair.seniorCode}</div>
              <div style={{ fontSize: 11, color: "#1C1A17" }}>{pair.juniorCode}</div>
              {[0, 1, 2].map((i) => {
                const hintContent = pair.hints[i]?.content?.trim() ?? "";
                const isSet = hintContent.length > 0;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: isSet ? "#3a6a2a" : "#8b2020",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 8,
                        color: isSet ? "#3a6a2a" : "#8b2020",
                        letterSpacing: 1,
                      }}
                    >
                      {isSet ? "SET" : "EMPTY"}
                    </span>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
