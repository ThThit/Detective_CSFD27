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
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-background">
      <p className="font-mono text-[10px] tracking-[4px] uppercase mb-6 text-subtle">
        CSFD27 · /LOGIN · CLASSIFIED ACCESS
      </p>

      <div
        className="relative overflow-hidden flex flex-col items-center justify-center max-w-96 py-10 bg-background font-serif torn-edges"
      >
        {/* Scanline */}
        <div
          className="absolute inset-x-0 h-0.5 pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(transparent, color-mix(in srgb, var(--color-accent) 6%, transparent), transparent)",
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
              "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 7%, transparent) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Seal badge */}
          <div
            className="relative flex items-center justify-center mb-7 bg-accent/6 border-2 border-accent/35"
            style={{
              width: 104,
              height: 104,
              borderRadius: "50%",
              animation: "fadeIn 0.6s ease-out both",
            }}
          >
            <div
              className="absolute inset-1.25 rounded-full border border-accent/15"
            />
            <div
              className="absolute inset-2.25 rounded-full border border-dashed border-accent/10"
            />
            <div className="text-center">
              <div className="font-display text-[22px] leading-none text-accent">
                CS
              </div>
              <div className="font-mono text-[8px] tracking-[4px] mt-0.5 text-accent/70">
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
                className="absolute rounded-full bg-accent opacity-50"
                style={{ width: 5, height: 5, ...style }}
              />
            ))}
          </div>

          {/* Classification */}
          <p
            className="font-mono text-[8px] tracking-[4px] uppercase mb-2.5 text-danger"
            style={{ animation: "fadeIn 0.6s ease-out 0.1s both" }}
          >
            ▸ RESTRICTED ACCESS
          </p>

          {/* Title */}
          <h1
            className="font-display text-[18px] text-center leading-snug mb-1.5 text-foreground"
            style={{ animation: "fadeIn 0.6s ease-out 0.15s both" }}
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
            <div className="flex-1 h-px bg-accent/18" />
            <span className="font-mono text-[8px] tracking-[3px] text-muted-fg">
              CREDENTIALS REQUIRED
            </span>
            <div className="flex-1 h-px bg-accent/18" />
          </div>

          <p
            className="text-[15px] text-center leading-[1.7] mb-4 text-muted"
            style={{ animation: "fadeIn 0.6s ease-out 0.25s both" }}
          >
            Authorized personnel only.
            <br />
            Present university credentials to access classified materials.
          </p>

          <p
            className="font-mono text-[9px] tracking-wide text-center mb-6 text-muted-fg"
            style={{ animation: "fadeIn 0.6s ease-out 0.27s both" }}
          >
            Use your{" "}
            <span className="text-accent">@ad.sit.kmutt.ac.th</span>{" "}
            account to sign in.
          </p>

          {/* Error message */}
          {errorMessage && (
            <div className="w-full mb-4 px-3 py-2.5 font-mono text-[9px] tracking-wide bg-danger/8 border border-danger/25 text-danger">
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
              className="flex items-center gap-3.5 w-full bg-surface border border-dark/20"
              style={{ padding: "16px 20px" }}
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
                <div className="font-display text-[13px] tracking-wide text-foreground">
                  Access Case Files
                </div>
                <div className="text-[11px] mt-0.5 tracking-wide text-muted">
                  Continue with Microsoft
                </div>
              </div>
              <div className="font-display text-lg text-accent">›</div>
            </a>

            <div
              className="flex items-center gap-2 mt-2.5 bg-surface border border-dark/10"
              style={{ padding: "10px 14px" }}
            >
              <div
                className="shrink-0 rounded-full bg-success"
                style={{
                  width: 6,
                  height: 6,
                  animation: "pulse 1.4s step-end infinite",
                }}
              />
              <span className="font-mono text-[9px] tracking-wide text-muted-fg">
                AWAITING AUTHENTICATION...
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-7 text-center">
          <p className="font-mono text-[8px] tracking-[2px] leading-[1.8] text-subtle">
            SIT · CS INTER · FRESHY DAY 2027
            <br />
            <span style={{ color: "#D8D0C4" }}>
              CONFIDENTIAL — DO NOT DISTRIBUTE
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
