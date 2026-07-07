"use client";

type HintCardProps = {
  hint: {
    id: string;
    content: string;
    revealDate: string;
    isRevealed: boolean;
  };
  index: number;
  variant: "senior" | "junior";
};

function formatFull(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

function formatShort(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    .toUpperCase();
}

export function HintCard({ hint, index, variant }: HintCardProps) {
  // ── JUNIOR VARIANT ────────────────────────────────────────────────
  if (variant === "junior") {
    if (hint.isRevealed) {
      return (
        <div style={{ background: "#E5E0CF", border: "1px solid rgba(58,106,42,0.3)", marginBottom: 8, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(58,106,42,0.15)", background: "rgba(58,106,42,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 5, height: 5, background: "#3a6a2a", borderRadius: "50%" }} />
              <span style={{ fontSize: 8, color: "#3a6a2a", letterSpacing: 2, fontFamily: "'Special Elite', monospace" }}>
                HINT {index} · RELEASED
              </span>
            </div>
            <span style={{ fontSize: 8, color: "#A0907E", letterSpacing: 1, fontFamily: "'Special Elite', monospace" }}>
              {formatShort(hint.revealDate)}
            </span>
          </div>
          <div style={{ padding: "12px 14px" }}>
            <p style={{ margin: 0, fontSize: 14, color: "#2F241F", lineHeight: 1.65, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
              &ldquo;{hint.content}&rdquo;
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ background: "#E5E0CF", border: "1px solid rgba(47,36,31,0.1)", overflow: "hidden", position: "relative", marginBottom: 8 }}>
        <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(47,36,31,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.45 }}>
            <div style={{ width: 5, height: 5, background: "#A0907E", borderRadius: "50%" }} />
            <span style={{ fontSize: 8, color: "#A0907E", letterSpacing: 2, fontFamily: "'Special Elite', monospace" }}>
              HINT {index} · SEALED
            </span>
          </div>
          <span style={{ fontSize: 8, color: "#C4B8A8", letterSpacing: 1, fontFamily: "'Special Elite', monospace" }}>
            {formatShort(hint.revealDate)}
          </span>
        </div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ height: 10, background: "repeating-linear-gradient(90deg,#C4B8A8 0px,#C4B8A8 5px,#E5E0CF 5px,#E5E0CF 8px)", borderRadius: 1 }} />
          <div style={{ height: 10, background: "repeating-linear-gradient(90deg,#C4B8A8 0px,#C4B8A8 5px,#E5E0CF 5px,#E5E0CF 8px)", borderRadius: 1, width: "70%" }} />
          <div style={{ height: 10, background: "repeating-linear-gradient(90deg,#C4B8A8 0px,#C4B8A8 5px,#E5E0CF 5px,#E5E0CF 8px)", borderRadius: 1, width: "85%" }} />
        </div>
        <div style={{ position: "absolute", top: "50%", right: 14, transform: "translateY(-50%) rotate(-4deg)", border: "2px solid rgba(139,32,32,0.4)", padding: "3px 8px" }}>
          <span style={{ fontFamily: "'Special Elite', monospace", fontSize: 10, color: "rgba(139,32,32,0.5)", letterSpacing: 2 }}>
            SEALED
          </span>
        </div>
      </div>
    );
  }

  // ── SENIOR VARIANT ────────────────────────────────────────────────
  const state = hint.isRevealed ? "released" : hint.content.trim() ? "pending" : "sealed";

  if (state === "released") {
    return (
      <div style={{ background: "#E5E0CF", border: "1px solid rgba(58,106,42,0.25)", marginBottom: 10, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(58,106,42,0.15)", background: "rgba(58,106,42,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 5, height: 5, background: "#3a6a2a", borderRadius: "50%" }} />
            <span style={{ fontSize: 8, color: "#3a6a2a", letterSpacing: 2, fontFamily: "'Special Elite', monospace" }}>
              HINT {index} · RELEASED
            </span>
          </div>
          <span style={{ fontSize: 8, color: "#A0907E", letterSpacing: 1, fontFamily: "'Special Elite', monospace" }}>
            {formatFull(hint.revealDate)}
          </span>
        </div>
        <div style={{ padding: "12px 14px" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#2F241F", lineHeight: 1.65, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
            &ldquo;{hint.content}&rdquo;
          </p>
        </div>
      </div>
    );
  }

  if (state === "pending") {
    return (
      <div style={{ background: "#E5E0CF", border: "1px solid rgba(168,106,42,0.3)", marginBottom: 10, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(168,106,42,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 5, height: 5, background: "#A86A2A", borderRadius: "50%" }} />
            <span style={{ fontSize: 8, color: "#A86A2A", letterSpacing: 2, fontFamily: "'Special Elite', monospace" }}>
              HINT {index} · PENDING
            </span>
          </div>
          <span style={{ fontSize: 8, color: "#A0907E", letterSpacing: 1, fontFamily: "'Special Elite', monospace" }}>
            {formatFull(hint.revealDate)}
          </span>
        </div>
        <div style={{ padding: "12px 14px" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#2F241F", lineHeight: 1.65, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
            &ldquo;{hint.content}&rdquo;
          </p>
        </div>
      </div>
    );
  }

  // Sealed
  return (
    <div style={{ background: "#E5E0CF", border: "1px solid rgba(47,36,31,0.12)", marginBottom: 10, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(47,36,31,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 5, height: 5, background: "#C4B8A8", borderRadius: "50%" }} />
          <span style={{ fontSize: 8, color: "#A0907E", letterSpacing: 2, fontFamily: "'Special Elite', monospace" }}>
            HINT {index} · SEALED
          </span>
        </div>
        <span style={{ fontSize: 8, color: "#C4B8A8", letterSpacing: 1, fontFamily: "'Special Elite', monospace" }}>
          {formatFull(hint.revealDate)}
        </span>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 10, background: "repeating-linear-gradient(90deg,#C4B8A8 0px,#C4B8A8 6px,transparent 6px,transparent 10px)", borderRadius: 2, opacity: 0.6 }} />
          <span style={{ fontSize: 9, color: "#C4B8A8", letterSpacing: 1, whiteSpace: "nowrap", fontFamily: "'Special Elite', monospace" }}>
            EMPTY
          </span>
        </div>
      </div>
    </div>
  );
}
