import Image from "next/image";
import Countdown from "../components/onboarding/Countdown";
import CtaButton from "../components/onboarding/CtaButton";

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized_account:
    "ACCESS DENIED — this account is not authorized for CSFD27.",
  invalid_state:
    "AUTHENTICATION FAILED — invalid or expired session. Please try again.",
  token_exchange_failed:
    "AUTHENTICATION FAILED — could not complete sign-in. Please try again.",
  graph_failed:
    "AUTHENTICATION FAILED — could not retrieve account details. Please try again.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorMessage =
    typeof params.error === "string" ? ERROR_MESSAGES[params.error] : undefined;
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar — full width */}

      {/* Corkboard hero — full width dark strip */}
      <div className="relative h-[206px] bg-dark overflow-hidden shrink-0">
        {/* background svg */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_38%_55%,#3C2C12_0%,#2F241F_52%,#1A1208_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,106,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(168,106,42,0.06)_1px,transparent_1px)] bg-[size:22px_22px]" />
        {/* background svg */}

        {/* Cards centered within a fixed-width inner container */}
        <div className="absolute inset-0 flex justify-center">
          <div className="relative w-full max-w-[480px]">
            <div className="absolute top-[15px] left-[62px] w-2.5 h-2.5 rounded-full bg-[#8b1a1a] shadow-[0_2px_6px_rgba(139,26,26,0.8)] z-4" />
            <div className="absolute top-5 left-4 w-[92px] h-[76px] bg-[#f0e8d2] rotate-[-5deg] shadow-[4px_5px_16px_rgba(0,0,0,0.6)] z-3">
              <div className="bg-[#cdbf9c] mx-[7px] mt-[7px] mb-[3px] h-[43px] flex items-center justify-center">
                <div className="text-[6px] text-[#6a5040] text-center leading-[1.5] font-mono">
                  OPERATIVE
                  <br />
                  PHOTO
                </div>
              </div>
              <div className="py-[2px] px-[7px] text-[5px] text-[#8b1a1a] tracking-[1px] font-mono">
                EXHIBIT A · UNKNOWN
              </div>
            </div>

            <div className="absolute top-1.5 left-[176px] w-2.5 h-2.5 rounded-full bg-[#3a4a7a] z-4" />
            <div className="absolute top-2.5 left-[130px] w-[112px] h-[70px] bg-[#ede4cc] rotate-[3deg] shadow-[4px_5px_16px_rgba(0,0,0,0.6)] z-3">
              <div className="p-2 text-[7px] text-[#2a1e0e] leading-[1.55] font-mono">
                <div className="text-[5px] text-[#8b1a1a] tracking-[1px] mb-1">
                  CASE #2026-CSFD
                </div>
                <strong>OPERATION:</strong>
                <br />
                FRESHY DAY
                <br />
                STATUS: <span className="text-[#3a6a2a]">ACTIVE</span>
              </div>
            </div>

            <div className="absolute top-[104px] left-[54px] w-2.5 h-2.5 rounded-full bg-accent shadow-[0_2px_6px_rgba(168,106,42,0.7)] z-4" />
            <div className="absolute top-[108px] left-[18px] w-[74px] h-[90px] bg-[#f0e8d2] rotate-[4deg] shadow-[4px_5px_16px_rgba(0,0,0,0.6)] z-3">
              <div className="m-1.5 h-[54px] bg-[#cdbf9c] flex items-center justify-center">
                <div className="text-[6px] text-[#6a5040] text-center leading-[1.4] font-mono">
                  YOUR
                  <br />
                  {"P'code?"}
                </div>
              </div>
              <div className="py-[2px] px-1.5 text-[5px] text-[#3a2a1a] font-mono">
                PENDING ID
              </div>
            </div>

            <div className="absolute top-[95px] left-[180px] w-2.5 h-2.5 rounded-full bg-[#4a7878] z-4" />
            <div className="absolute top-[98px] left-[116px] w-[152px] h-[90px] bg-[#1C1208] border border-accent/35 rotate-[-2deg] shadow-[4px_5px_16px_rgba(0,0,0,0.6)] z-3">
              <div className="p-[11px]">
                <div className="text-[5px] text-accent tracking-[2px] mb-1.5 font-mono">
                  CIPHER DIVISION
                </div>
                <div className="font-display text-xs text-[#D8C0A0] leading-[1.3]">
                  IDENTIFY
                  <br />
                  YOUR
                  <br />
                  SENIOR
                </div>
              </div>
            </div>

            {/* Red strings */}
            <svg
              className="absolute inset-0 w-full h-[286px] pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="62"
                y1="60"
                x2="133"
                y2="50"
                stroke="#8b1a1a"
                strokeWidth="1.5"
                opacity="0.45"
              />
              <line
                x1="186"
                y1="46"
                x2="270"
                y2="128"
                stroke="#8b1a1a"
                strokeWidth="1"
                opacity="0.35"
              />
              <line
                x1="55"
                y1="128"
                x2="118"
                y2="165"
                stroke="#8b1a1a"
                strokeWidth="1"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>

        {/* CLASSIFIED stamp — anchored to hero edges */}
        <div className="absolute bottom-[18px] right-6 border-[2.5px] border-[#8b1a1a]/75 py-[3px] px-2.5 rotate-[-6deg] animate-[stampIn_0.9s_ease-out_0.5s_both] z-6">
          <div className="font-mono text-xs text-[#8b1a1a]/75 tracking-[3px]">
            CLASSIFIED
          </div>
        </div>
        <div className="absolute bottom-[22px] left-6 text-[7px] text-[#D8C0A0]/35 tracking-[2px] z-6 font-mono">
          CASE #2026-CSFD
        </div>
      </div>

      {/* Content — centered column, comfortable reading width */}
      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-[640px] mx-auto px-6 flex-1 flex flex-col">
          {/* Heading */}
          <div className="py-7 pb-3 border-foreground/10">
            {/*<div className="flex items-center gap-2 mb-3.5">
              <div className="w-2 h-2 bg-danger rounded-full animate-[pulse_1s_step-end_infinite] shrink-0" />
              <div className="text-[11px] text-danger tracking-[3px] uppercase font-mono">
                Active Investigation
              </div>
            </div>*/}
            <div className="flex items-center gap-3.5 mb-3">
              <Image
                src="/logo.jpg"
                alt="KMUTT Investigation Bureau logo"
                width={56}
                height={56}
                className="rounded-full object-cover shrink-0"
              />
              <div className="font-display text-[28px] text-foreground leading-[1.2]">
                CS First Date
                <br />
                2026
              </div>
            </div>
            {/*<div className="h-px bg-accent/25 mb-2" />*/}
            <p className="m-0 text-lg text-foreground leading-[1.5]">
              {
                "Seniors have gone undercover. Junior operatives must identify their assigned P'code before the deadline."
              }
            </p>
          </div>

          <div className="h-px bg-accent/25 my-2" />

          {/* Countdown */}
          <Countdown />

          {/* CTA */}
          <div className="pb-5">
            {errorMessage && (
              <div className="mb-3 px-3 py-2.5 font-mono text-[9px] tracking-wide bg-danger/8 border border-danger/25 text-danger">
                ✕ {errorMessage}
              </div>
            )}
            <div className="text-[11px] text-muted tracking-[3px] text-center mb-3 font-mono">
              — OPERATIVE ACCESS REQUIRED —
            </div>
            <CtaButton />
            <p
            className="font-mono text-[9px] tracking-wide text-center text-muted-fg mt-2"
            // style={{ animation: "fadeIn 0.6s ease-out 0.27s both" }}
          >
            Use your <span className="text-accent">@ad.sit.kmutt.ac.th</span>{" "}
            account to sign in.
          </p>
          </div>


          {/* Footer */}
          {/*<div className="mt-auto py-4 pb-8 text-center border-t border-foreground/[0.08]">
            <div className="text-[9px] text-subtle tracking-[3px] font-mono">
              CSFD27 · SIT · KMUTT
            </div>
          </div>*/}
        </div>
      </div>
    </div>
  );
}
