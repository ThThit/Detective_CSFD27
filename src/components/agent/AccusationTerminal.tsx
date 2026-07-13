"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Hint } from "@/types";

type SolvedSenior = {
  displayName: string;
  nickname: string | null;
  house: string;
  profileUrl: string | null;
};

type AccusationTerminalProps = {
  initialGuessLeft: number;
  initialIsFound: boolean;
  initialHints: Hint[];
  initialSolvedSenior: SolvedSenior | null;
  initialSolvedAt: string | null;
};

const TOTAL_ATTEMPTS = 3;

export function AccusationTerminal({
  initialGuessLeft,
  initialIsFound,
  initialHints,
  initialSolvedSenior,
  initialSolvedAt,
}: AccusationTerminalProps) {
  const [input, setInput] = useState("");
  const [guessLeft, setGuessLeft] = useState(initialGuessLeft);
  const [isFound, setIsFound] = useState(initialIsFound);
  const [errorMsg, setErrorMsg] = useState("");
  const [shaking, setShaking] = useState(false);
  const [solvedSenior, setSolvedSenior] = useState<SolvedSenior | null>(
    initialSolvedSenior,
  );
  const [loading, setLoading] = useState(false);
  const [solvedAt] = useState(() =>
    initialSolvedAt ? new Date(initialSolvedAt) : new Date(),
  );

  const attemptsUsed = TOTAL_ATTEMPTS - guessLeft;

  async function handleSubmit() {
    if (loading) return;
    if (!/^\d{3}$/.test(input)) {
      setErrorMsg("ID must be exactly 3 digits.");
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setShaking(true);
        setTimeout(() => setShaking(false), 450);
        return;
      }
      if (data.correct) {
        setSolvedSenior(data.senior);
        setIsFound(true);
      } else {
        const newLives: number = data.livesLeft;
        setGuessLeft(newLives);
        setErrorMsg(
          `Wrong ID. That operative remains at large. ${newLives} chance${newLives !== 1 ? "s" : ""} remaining.`,
        );
        setShaking(true);
        setTimeout(() => setShaking(false), 450);
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Solved state ────────────────────────────────────────────────────────────
  if (isFound) {
    const senior = solvedSenior;
    const houseLabel = (senior?.house ?? "").toUpperCase();
    const closedDate = solvedAt
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
    const closedTime = solvedAt.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="bg-background relative min-h-fit flex flex-col items-center justify-center px-6 py-8 text-center animate-[overlayIn_0.4s_ease-out_both]">
        {/* Stamp */}
        <div className="inline-block border-[3px] border-success px-6 py-[7px] mb-5 animate-[closedStamp_0.8s_ease-out_both]">
          <div className="font-display text-[20px] text-success tracking-[3px]">
            CASE CLOSED
          </div>
        </div>

        <div className="text-[8px] text-success tracking-[4px] mb-1 font-mono animate-[revealUp_0.5s_ease-out_0.3s_both] opacity-0">
          CONFESSION SEALED
        </div>
        <div className="text-[8px] text-foreground tracking-[3px] mb-7 font-mono animate-[revealUp_0.5s_ease-out_0.4s_both] opacity-0">
          OPERATIVE IDENTIFIED
        </div>

        {/* Identity card */}
        <div className="bg-surface border border-success/30 py-[22px] px-5 w-full max-w-[360px] mb-[18px] animate-[revealUp_0.5s_ease-out_0.5s_both] opacity-0">
          <div className="text-[7px] text-foreground tracking-[3px] mb-3.5 font-mono">
            SENIOR OPERATIVE REVEALED
          </div>

          {/* Photo */}
          <div
            className={`w-[60px] h-[60px] rounded-full border-2 border-success/35 mx-auto mb-3.5 overflow-hidden flex items-center justify-center ${senior?.profileUrl ? "bg-transparent" : "bg-background"}`}
          >
            {senior?.profileUrl ? (
              <img
                src={senior.profileUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[7px] text-muted-fg font-mono text-center leading-[1.3]">
                PHOTO
              </span>
            )}
          </div>

          <div className="font-display text-[17px] text-foreground mb-1 leading-[1.2]">
            {senior?.nickname ?? senior?.displayName ?? "—"}
          </div>
          {/*{senior?.nickname && (
            <div className="text-[13px] text-accent mb-3.5 tracking-[1px] font-serif italic">
              Alias: <strong>{senior.nickname}</strong>
            </div>
          )}*/}

          <div
            className={`flex gap-2 justify-center ${senior?.nickname ? "mt-0" : "mt-3.5"}`}
          >
            <div className="py-[3px] px-2 bg-accent/10 border border-accent/30 text-[8px] text-accent tracking-[1px] font-mono">
              {houseLabel}
            </div>
            <div className="py-[3px] px-2 bg-success/10 border border-success/30 text-[8px] text-success tracking-[1px] font-mono">
              IDENTIFIED
            </div>
          </div>
        </div>

        {/* Case reference */}
        <div className="text-[9px] text-foreground tracking-[2px] leading-[1.9] mb-[22px] font-mono animate-[revealUp_0.5s_ease-out_0.6s_both] opacity-0">
          CASE #2027-CSFD-{houseLabel.slice(0, 3)}-CLOSED
          <br />
          CLOSED: {closedDate} · {closedTime} ICT
          <br />
          ATTEMPTS USED: {attemptsUsed + 1} OF {TOTAL_ATTEMPTS}
        </div>
      </div>
    );
  }

  // ── Expired state ───────────────────────────────────────────────────────────
  if (guessLeft === 0 && !isFound) {
    return (
      <div className="py-4">
        <div className="bg-danger/6 border border-danger/15 py-6 px-5 text-center mb-5">
          <div className="font-display text-[18px] text-danger tracking-[2px] mb-2.5">
            CASE EXPIRED
          </div>
          <div className="text-[14px] text-muted font-serif italic leading-[1.6]">
            This operative has evaded identification.
          </div>
        </div>

        {initialHints.length > 0 && (
          <>
            <div className="text-[8px] text-muted-fg tracking-[3px] uppercase mb-2.5 font-mono">
              EVIDENCE ON HAND
            </div>
            {initialHints.map((h, i) => (
              <HintCardInline key={h.id} hint={h} index={i} />
            ))}
          </>
        )}
      </div>
    );
  }

  // ── Active state ─────────────────────────────────────────────────────────────
  return (
    <div className="py-4">
      <div className="text-[8px] text-danger tracking-[4px] uppercase mb-3 font-mono">
        ▸ ACTIVE CASE
      </div>

      {/* Terminal block */}
      <div className="bg-background border border-danger/20 overflow-hidden mb-6">
        {/* Header row */}
        <div className="py-2.5 px-3.5 border-b border-danger/12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-danger rounded-full animate-[pulse_1s_step-end_infinite]" />
            <div className="text-[8px] text-danger tracking-[3px] font-mono">
              SUSPECT ID TERMINAL
            </div>
          </div>

          {/* Tally marks + counter */}
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1 items-center">
              {Array.from({ length: TOTAL_ATTEMPTS }).map((_, i) => {
                const used = i < attemptsUsed;
                return (
                  <div key={i} className="relative w-2.5 h-[22px]">
                    <div
                      className={`absolute top-0 left-1 w-0.5 h-[22px] rounded-[1px] ${used ? "bg-danger/60" : "bg-dark"}`}
                    />
                    {used && (
                      <div className="absolute top-1/2 left-0 w-2.5 h-0.5 bg-danger/50 -translate-y-1/2 -rotate-[20deg] rounded-[1px]" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-[11px] text-foreground font-display">
              {guessLeft}{" "}
              <span className="text-[10px] text-muted-fg">
                / {TOTAL_ATTEMPTS}
              </span>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="py-3 px-3.5">
          <div className="text-[9px] text-foreground tracking-[2px] mb-2 font-mono">
            ENTER LAST 3 DIGITS OF STUDENT ID:
          </div>

          <div
            className={`flex items-stretch bg-background border ${errorMsg ? "border-danger/40" : "border-accent/22"} ${shaking ? "animate-[shake_0.4s_ease-out]" : ""}`}
          >
            <div className="p-2.5 text-[11px] text-accent border-r border-accent/18 flex items-center font-mono">
              ›_
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="XXX"
              value={input}
              maxLength={3}
              onChange={(e) => {
                setInput(e.target.value);
                setErrorMsg("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              disabled={loading}
              className="flex-1 bg-transparent border-none outline-none font-mono text-[18px] text-foreground pt-2 pb-1 px-3 tracking-[3px] caret-accent"
            />
          </div>

          {errorMsg && (
            <div className="mt-2 bg-danger/6 border border-danger/20 py-2 px-3 flex items-center gap-2">
              <div className="w-1 h-1 bg-danger rounded-full shrink-0" />
              <div className="text-[12px] text-danger leading-[1.5] font-serif">
                {errorMsg}
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="p-3.5 pt-0">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3.5 border-none text-center ${loading ? "bg-[#5a3838] cursor-not-allowed" : "bg-danger cursor-pointer"}`}
          >
            <div className="font-mono text-[11px] text-background tracking-[4px]">
              {loading ? "TRANSMITTING..." : "SUBMIT ACCUSATION ›"}
            </div>
          </button>
        </div>
      </div>

      {/* Evidence section */}
      {initialHints.length > 0 && (
        <>
          <div className="text-[8px] text-muted-fg tracking-[3px] uppercase mb-2.5 font-mono">
            EVIDENCE ON HAND
          </div>
          {initialHints.map((h, i) => (
            <HintCardInline key={h.id} hint={h} index={i} />
          ))}
        </>
      )}
    </div>
  );
}

function HintCardInline({ hint, index }: { hint: Hint; index: number }) {
  const revealDate = new Date(hint.revealDate)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })
    .toUpperCase();

  if (!hint.isRevealed) {
    return (
      <div className="bg-surface border border-dark/10 mb-2 overflow-hidden opacity-60">
        <div className="py-2.5 px-3.5 flex items-center justify-between border-b border-dark/6">
          <div className="flex items-center gap-2">
            <div className="w-[5px] h-[5px] bg-muted-fg rounded-full" />
            <div className="text-[8px] text-muted-fg tracking-[2px] font-mono">
              HINT {index + 1} · SEALED
            </div>
          </div>
          <div className="text-[8px] text-muted-fg tracking-[1px] font-mono">
            {revealDate}
          </div>
        </div>
        <div className="py-3 px-3.5">
          <div className="text-[12px] text-muted-fg tracking-[1px] font-mono">
            LOCKED UNTIL RELEASE
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-success/30 mb-2 overflow-hidden">
      <div className="py-2.5 px-3.5 flex items-center justify-between border-b border-success/15 bg-success/6">
        <div className="flex items-center gap-2">
          <div className="w-[5px] h-[5px] bg-success rounded-full" />
          <div className="text-[8px] text-success tracking-[2px] font-mono">
            HINT {index + 1} · REVEALED
          </div>
        </div>
        <div className="text-[8px] text-muted-fg tracking-[1px] font-mono">
          {revealDate}
        </div>
      </div>
      <div className="py-3 px-3.5">
        <div className="text-[14px] text-dark leading-[1.65] italic font-serif">
          &ldquo;{hint.content}&rdquo;
        </div>
      </div>
    </div>
  );
}
