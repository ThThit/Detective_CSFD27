const ERROR_MESSAGES: Record<string, string> = {
  unauthorized_account:
    "ACCESS DENIED — this account is not authorized for CSFD27.",
  invalid_state:
    "AUTHENTICATION FAILED — invalid or expired session. Please try again.",
  token_exchange_failed:
    "AUTHENTICATION FAILED — could not complete sign-in. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorMessage =
    typeof params.error === "string" ? ERROR_MESSAGES[params.error] : undefined;
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-10 px-4"
      style={{ background: "#F3EEE5" }}
    >
      <p
        className="font-mono text-[10px] tracking-[4px] uppercase mb-6"
        style={{ color: "#C4B8A8" }}
      >
        CSFD27 · /LOGIN · CLASSIFIED ACCESS
      </p>

      <div
        className="relative overflow-hidden flex flex-col items-center justify-center max-w-96 py-10"
        style={{
          background: "#F3EEE5",
          fontFamily: "var(--font-cormorant-garamond), serif",
        }}
      >
        {/* Scanline */}
        <div
          className="absolute inset-x-0 h-0.5 pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(transparent, rgba(168,106,42,0.06), transparent)",
            animation: "scanline 5s linear infinite",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "25%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle, rgba(168,106,42,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Seal badge */}
          <div
            className="relative flex items-center justify-center mb-7"
            style={{
              width: 104,
              height: 104,
              borderRadius: "50%",
              border: "2px solid rgba(168,106,42,0.35)",
              background: "rgba(168,106,42,0.06)",
              animation: "fadeIn 0.6s ease-out both",
            }}
          >
            <div
              className="absolute inset-1.25 rounded-full"
              style={{ border: "1px solid rgba(168,106,42,0.15)" }}
            />
            <div
              className="absolute inset-2.25 rounded-full"
              style={{ border: "1px dashed rgba(168,106,42,0.1)" }}
            />
            <div className="text-center">
              <div
                className="font-display text-[22px] leading-none"
                style={{ color: "#A86A2A" }}
              >
                CS
              </div>
              <div
                className="font-mono text-[8px] tracking-[4px] mt-0.5"
                style={{ color: "rgba(168,106,42,0.7)" }}
              >
                FD27
              </div>
            </div>
            {[
              { top: 3, left: "50%", transform: "translateX(-50%)" },
              { bottom: 3, left: "50%", transform: "translateX(-50%)" },
              { left: 3, top: "50%", transform: "translateY(-50%)" },
              { right: 3, top: "50%", transform: "translateY(-50%)" },
            ].map((style, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  background: "#A86A2A",
                  opacity: 0.5,
                  ...style,
                }}
              />
            ))}
          </div>

          {/* Classification */}
          <p
            className="font-mono text-[8px] tracking-[4px] uppercase mb-2.5"
            style={{
              color: "#8b2020",
              animation: "fadeIn 0.6s ease-out 0.1s both",
            }}
          >
            ▸ RESTRICTED ACCESS
          </p>

          {/* Title */}
          <h1
            className="font-display text-[18px] text-center leading-snug mb-1.5"
            style={{
              color: "#1C1A17",
              animation: "fadeIn 0.6s ease-out 0.15s both",
            }}
          >
            Case Sensitive
            <br />
            Freshy Day 2027
          </h1>

          {/* Divider */}
          <div
            className="w-full flex items-center gap-3 my-5.5"
            style={{ animation: "fadeIn 0.6s ease-out 0.2s both" }}
          >
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(168,106,42,0.18)" }}
            />
            <span
              className="font-mono text-[8px] tracking-[3px]"
              style={{ color: "#A0907E" }}
            >
              CREDENTIALS REQUIRED
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(168,106,42,0.18)" }}
            />
          </div>

          <p
            className="text-[15px] text-center leading-[1.7] mb-4"
            style={{
              color: "#7A6A58",
              animation: "fadeIn 0.6s ease-out 0.25s both",
            }}
          >
            Authorized personnel only.
            <br />
            Present university credentials to access classified materials.
          </p>

          <p
            className="font-mono text-[9px] tracking-wide text-center mb-6"
            style={{
              color: "#A0907E",
              animation: "fadeIn 0.6s ease-out 0.27s both",
            }}
          >
            Use your{" "}
            <span style={{ color: "#A86A2A" }}>@ad.sit.kmutt.ac.th</span>{" "}
            account to sign in.
          </p>

          {/* Error message */}
          {errorMessage && (
            <div
              className="w-full mb-4 px-3 py-2.5 font-mono text-[9px] tracking-wide"
              style={{
                background: "rgba(139,32,32,0.08)",
                border: "1px solid rgba(139,32,32,0.25)",
                color: "#8b2020",
              }}
            >
              ✕ {errorMessage}
            </div>
          )}

          {/* Login button + status */}
          <div
            className="w-full"
            style={{ animation: "fadeIn 0.6s ease-out 0.3s both" }}
          >
            <a
              href="/api/auth/login"
              className="flex items-center gap-3.5 w-full"
              style={{
                background: "#E5E0CF",
                border: "1px solid rgba(47,36,31,0.2)",
                padding: "16px 20px",
              }}
            >
              <div
                className="grid grid-cols-2 grid-rows-2 gap-0.5 shrink-0"
                style={{ width: 20, height: 20 }}
              >
                <div style={{ background: "#f25022", borderRadius: 1 }} />
                <div style={{ background: "#7fba00", borderRadius: 1 }} />
                <div style={{ background: "#00a4ef", borderRadius: 1 }} />
                <div style={{ background: "#ffb900", borderRadius: 1 }} />
              </div>
              <div className="flex-1">
                <div
                  className="font-display text-[13px] tracking-wide"
                  style={{ color: "#1C1A17" }}
                >
                  Access Case Files
                </div>
                <div
                  className="text-[11px] mt-0.5 tracking-wide"
                  style={{ color: "#7A6A58" }}
                >
                  Continue with Microsoft
                </div>
              </div>
              <div
                className="font-display text-lg"
                style={{ color: "#A86A2A" }}
              >
                ›
              </div>
            </a>

            <div
              className="flex items-center gap-2 mt-2.5"
              style={{
                background: "#E5E0CF",
                border: "1px solid rgba(47,36,31,0.1)",
                padding: "10px 14px",
              }}
            >
              <div
                className="shrink-0 rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: "#3a6a2a",
                  animation: "pulse 1.4s step-end infinite",
                }}
              />
              <span
                className="font-mono text-[9px] tracking-wide"
                style={{ color: "#A0907E" }}
              >
                AWAITING AUTHENTICATION...
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-7 text-center">
          <p
            className="font-mono text-[8px] tracking-[2px] leading-[1.8]"
            style={{ color: "#C4B8A8" }}
          >
            SIT · CS INTER · FRESHY DAY 2027
            <br />
            <span style={{ color: "#D8D0C4" }}>
              CONFIDENTIAL — DO NOT DISTRIBUTE
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
        @keyframes pulse { 0%, 49% { opacity: 1; } 50%, 99% { opacity: 0.2; } }
      `}</style>
    </div>
  );
}
