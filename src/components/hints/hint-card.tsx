"use client";

type Hint = {
  id: string;
  content: string;
  revealDate: string;
  isRevealed: boolean;
};

type HintCardProps = {
  hint: Hint;
  index: number;
  variant: "senior" | "junior";
};

type Status = "released" | "pending" | "sealed";

const FONT_MONO = "'Special Elite', monospace";
const FONT_SERIF = "'Cormorant Garamond', serif";

const STATUS_STYLES: Record<
  Status,
  { label: string; dot: string; text: string; border: string; headerBg?: string }
> = {
  released: {
    label: "RELEASED",
    dot: "#3a6a2a",
    text: "#3a6a2a",
    border: "rgba(58,106,42,0.25)",
    headerBg: "rgba(58,106,42,0.06)",
  },
  pending: {
    label: "PENDING",
    dot: "#A86A2A",
    text: "#A86A2A",
    border: "rgba(168,106,42,0.3)",
  },
  sealed: {
    label: "SEALED",
    dot: "#C4B8A8",
    text: "#A0907E",
    border: "rgba(47,36,31,0.12)",
  },
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

function getStatus(hint: Hint): Status {
  if (hint.isRevealed) return "released";
  return hint.content.trim() ? "pending" : "sealed";
}

// ── Shared building blocks ──────────────────────────────────────────

function CardShell({
  status,
  marginBottom,
  children,
}: {
  status: Status;
  marginBottom: number;
  children: React.ReactNode;
}) {
  const { border } = STATUS_STYLES[status];
  return (
    <div
      style={{
        background: "#E5E0CF",
        borderInline: `1px solid ${border}`,
        marginBottom,
        overflow: "hidden",
        position: "relative",
      }}
      className="torn-bottom-sm"
    >
      {children}
    </div>
  );
}

function HintHeader({
  status,
  index,
  dateLabel,
  dimmed = false,
}: {
  status: Status;
  index: number;
  dateLabel: string;
  dimmed?: boolean;
}) {
  const { label, dot, text, headerBg } = STATUS_STYLES[status];
  return (
    <div
      style={{
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${STATUS_STYLES[status].border}`,
        background: headerBg,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: dimmed ? 0.45 : 1 }}>
        <div style={{ width: 5, height: 5, background: dot, borderRadius: "50%" }} />
        <span className="text-[10px] min-[440px]:text-[8px]" style={{ color: text, letterSpacing: 2, fontFamily: FONT_MONO }}>
          HINT {index} · {label}
        </span>
      </div>
      <span className="text-[10px] min-[440px]:text-[8px]" style={{ color: dimmed ? "#C4B8A8" : "#A0907E", letterSpacing: 1, fontFamily: FONT_MONO }}>
        {dateLabel}
      </span>
    </div>
  );
}

function HintQuote({ content }: { content: string }) {
  return (
    <div style={{ padding: "12px 14px" }}>
      <p
        className="text-[17px] min-[440px]:text-[14px]"
        style={{
          margin: 0,
          color: "#2F241F",
          lineHeight: 1.65,
          fontStyle: "italic",
          fontFamily: FONT_SERIF,
        }}
      >
        &ldquo;{content}&rdquo;
      </p>
    </div>
  );
}

// ── Junior variant ───────────────────────────────────────────────────

function JuniorSealedBody() {
  const barStyle = {
    height: 10,
    background:
      "repeating-linear-gradient(90deg,#C4B8A8 0px,#C4B8A8 5px,#E5E0CF 5px,#E5E0CF 8px)",
    borderRadius: 1,
  };
  return (
    <>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={barStyle} />
        <div style={{ ...barStyle, width: "70%" }} />
        <div style={{ ...barStyle, width: "85%" }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 14,
          transform: "translateY(-50%) rotate(-4deg)",
          border: "2px solid rgba(139,32,32,0.4)",
          padding: "3px 8px",
        }}
      >
        <span className="text-[12px] min-[440px]:text-[10px]" style={{ fontFamily: FONT_MONO, color: "rgba(139,32,32,0.5)", letterSpacing: 2 }}>
          SEALED
        </span>
      </div>
    </>
  );
}

function JuniorHintCard({ hint, index }: { hint: Hint; index: number }) {
  const status: Status = hint.isRevealed ? "released" : "sealed";

  return (
    <CardShell status={status} marginBottom={8}>
      <HintHeader
        status={status}
        index={index}
        dateLabel={formatShort(hint.revealDate)}
        dimmed={status === "sealed"}
      />
      {status === "released" ? <HintQuote content={hint.content} /> : <JuniorSealedBody />}
    </CardShell>
  );
}

// ── Senior variant ───────────────────────────────────────────────────

function SeniorSealedBody() {
  return (
    <div style={{ padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            flex: 1,
            height: 10,
            background:
              "repeating-linear-gradient(90deg,#C4B8A8 0px,#C4B8A8 6px,transparent 6px,transparent 10px)",
            borderRadius: 2,
            opacity: 0.6,
          }}
        />
        <span className="text-[11px] min-[440px]:text-[9px]" style={{ color: "#C4B8A8", letterSpacing: 1, whiteSpace: "nowrap", fontFamily: FONT_MONO }}>
          EMPTY
        </span>
      </div>
    </div>
  );
}

function SeniorHintCard({ hint, index }: { hint: Hint; index: number }) {
  const status = getStatus(hint);

  return (
    <CardShell status={status} marginBottom={10}>
      <HintHeader status={status} index={index} dateLabel={formatFull(hint.revealDate)} />
      {status === "sealed" ? <SeniorSealedBody /> : <HintQuote content={hint.content} />}
    </CardShell>
  );
}

// ── Entry point ──────────────────────────────────────────────────────

export function HintCard({ hint, index, variant }: HintCardProps) {
  return variant === "junior" ? (
    <JuniorHintCard hint={hint} index={index} />
  ) : (
    <SeniorHintCard hint={hint} index={index} />
  );
}
