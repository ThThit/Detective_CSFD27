"use client";

import { useState, type ReactNode } from "react";
import { HOUSE_META, type House } from "@/lib/constants/houses";

type Props = {
  userHouse: House;
  children: ReactNode;
};

export function OnboardingOverlay({ userHouse, children }: Props) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const houseMeta = HOUSE_META[userHouse];

  async function handleConfirmNickname() {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      setError("Alias must be 2–30 characters.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/auth/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: trimmed }),
      });
      if (res.ok) {
        setStep(2);
      } else {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          filter: visible ? "blur(2px)" : "none",
          transition: "filter 0.2s",
        }}
      >
        {children}
      </div>

      {visible && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(243,238,229,0.88)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            zIndex: 20,
            animation: "overlayIn 0.3s ease-out both",
          }}
        >
          <div
            style={{
              background: "#E0D3AC",
              borderTop: "1px solid rgba(168,106,42,0.28)",
              padding: "28px 24px 40px",
              animation: "slideUp 0.35s ease-out both",
            }}
          >
            {step === 1 ? (
              <>
                <div
                  style={{
                    fontSize: 8,
                    color: "#8b2020",
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    marginBottom: 14,
                    fontFamily: "var(--font-special-elite), monospace",
                  }}
                >
                  STEP 1 OF 2 · ALIAS ASSIGNMENT
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-cinzel-decorative), serif",
                    fontSize: 18,
                    color: "#1C1A17",
                    marginBottom: 6,
                  }}
                >
                  Choose Your Alias
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#7A6A58",
                    marginBottom: 22,
                    lineHeight: 1.6,
                  }}
                >
                  Every operative needs a code name. Choose wisely — it will
                  appear on all case files.
                </div>

                <div
                  style={{
                    background: "#EDE1C4",
                    border: "1px solid rgba(168,106,42,0.25)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    marginBottom: error ? 8 : 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#A86A2A",
                      fontFamily: "var(--font-special-elite), monospace",
                    }}
                  >
                    ›
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Shadow, Oracle, Wraith..."
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      if (error) setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConfirmNickname();
                    }}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "var(--font-cormorant-garamond), serif",
                      fontSize: 16,
                      color: "#1C1A17",
                      caretColor: "#A86A2A",
                      width: "100%",
                    }}
                  />
                </div>

                {error && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#8b2020",
                      marginBottom: 14,
                      fontFamily: "var(--font-special-elite), monospace",
                      letterSpacing: 1,
                    }}
                  >
                    ✕ {error}
                  </div>
                )}

                <button
                  onClick={handleConfirmNickname}
                  disabled={saving}
                  style={{
                    width: "100%",
                    background: "#2F241F",
                    padding: 14,
                    textAlign: "center",
                    cursor: saving ? "not-allowed" : "pointer",
                    border: "none",
                    opacity: saving ? 0.65 : 1,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-cinzel-decorative), serif",
                      fontSize: 13,
                      color: "#D8C0A0",
                      letterSpacing: 2,
                    }}
                  >
                    {saving ? "Saving..." : "Confirm Alias"}
                  </div>
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 8,
                    color: "#8b2020",
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    marginBottom: 14,
                    fontFamily: "var(--font-special-elite), monospace",
                  }}
                >
                  STEP 2 OF 2 · DIVISION ASSIGNMENT
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-cinzel-decorative), serif",
                    fontSize: 18,
                    color: "#1C1A17",
                    marginBottom: 20,
                  }}
                >
                  The Magic Pot Decides
                </div>

                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: "2px solid rgba(168,106,42,0.35)",
                      margin: "0 auto 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(168,106,42,0.06)",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "2px solid #A86A2A",
                        borderTopColor: "transparent",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#A0907E",
                      letterSpacing: 3,
                      marginBottom: 24,
                      fontFamily: "var(--font-special-elite), monospace",
                    }}
                  >
                    DRAWING YOUR ASSIGNMENT...
                  </div>

                  <div
                    style={{
                      background: "#EDE1C4",
                      border: "1px solid rgba(168,106,42,0.3)",
                      padding: 20,
                      animation: "revealPot 0.6s ease-out 1.2s both",
                      opacity: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        color: "#A86A2A",
                        letterSpacing: 3,
                        marginBottom: 8,
                        fontFamily: "var(--font-special-elite), monospace",
                      }}
                    >
                      YOU HAVE BEEN ASSIGNED TO
                    </div>
                    <div
                      style={{
                        height: 2,
                        background: "rgba(168,106,42,0.25)",
                        marginBottom: 14,
                      }}
                    />
                    <div
                      style={{
                        fontFamily: "var(--font-cinzel-decorative), serif",
                        fontSize: 20,
                        color: houseMeta.color,
                        marginBottom: 4,
                        lineHeight: 1.3,
                      }}
                    >
                      {houseMeta.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: houseMeta.color,
                        letterSpacing: 2,
                        fontFamily: "var(--font-special-elite), monospace",
                        marginBottom: 6,
                        opacity: 0.8,
                      }}
                    >
                      {houseMeta.tagline}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#7A6A58",
                        fontStyle: "italic",
                        fontFamily: "var(--font-cormorant-garamond), serif",
                      }}
                    >
                      {houseMeta.desc}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setVisible(false)}
                  style={{
                    width: "100%",
                    background: "#A86A2A",
                    padding: 14,
                    textAlign: "center",
                    cursor: "pointer",
                    border: "none",
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-cinzel-decorative), serif",
                      fontSize: 13,
                      color: "#EDE1C4",
                      letterSpacing: 2,
                    }}
                  >
                    Enter Division HQ
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
