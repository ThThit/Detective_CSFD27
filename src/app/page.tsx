import Countdown from "../components/onboarding/Countdown";
import CtaButton from "../components/onboarding/CtaButton";

export default function Home() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Navbar — full width */}
      <div
        style={{
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(47,36,31,0.14)",
          flexShrink: 0,
          background: "#E0D3AC",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-cinzel-decorative), serif",
            fontSize: 16,
            color: "#2F241F",
            letterSpacing: 1,
          }}
        >
          CSFD27
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#A0907E",
            letterSpacing: 4,
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          EST. 2027
        </div>
      </div>

      {/* Corkboard hero — full width dark strip */}
      <div
        className="torn-bottom"
        style={{
          position: "relative",
          height: 206,
          background: "#2F241F",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* background svg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 38% 55%,#3C2C12 0%,#2F241F 52%,#1A1208 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(168,106,42,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(168,106,42,0.06) 1px,transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* background svg */}

        {/* Cards centered within a fixed-width inner container */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
            <div
              style={{
                position: "absolute",
                top: 15,
                left: 62,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#8b1a1a",
                boxShadow: "0 2px 6px rgba(139,26,26,0.8)",
                zIndex: 4,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 16,
                width: 92,
                height: 76,
                background: "#f0e8d2",
                transform: "rotate(-5deg)",
                boxShadow: "4px 5px 16px rgba(0,0,0,0.6)",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  background: "#cdbf9c",
                  margin: "7px 7px 3px",
                  height: 43,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 6,
                    color: "#6a5040",
                    textAlign: "center",
                    lineHeight: 1.5,
                    fontFamily: "var(--font-special-elite), monospace",
                  }}
                >
                  OPERATIVE
                  <br />
                  PHOTO
                </div>
              </div>
              <div
                style={{
                  padding: "2px 7px",
                  fontSize: 5,
                  color: "#8b1a1a",
                  letterSpacing: 1,
                  fontFamily: "var(--font-special-elite), monospace",
                }}
              >
                EXHIBIT A · UNKNOWN
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 6,
                left: 176,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#3a4a7a",
                zIndex: 4,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 130,
                width: 112,
                height: 70,
                background: "#ede4cc",
                transform: "rotate(3deg)",
                boxShadow: "4px 5px 16px rgba(0,0,0,0.6)",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  padding: 8,
                  fontSize: 7,
                  color: "#2a1e0e",
                  lineHeight: 1.55,
                  fontFamily: "var(--font-special-elite), monospace",
                }}
              >
                <div
                  style={{
                    fontSize: 5,
                    color: "#8b1a1a",
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  CASE #2026-CSFD
                </div>
                <strong>OPERATION:</strong>
                <br />
                FRESHY DAY
                <br />
                STATUS: <span style={{ color: "#3a6a2a" }}>ACTIVE</span>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 104,
                left: 54,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#A86A2A",
                boxShadow: "0 2px 6px rgba(168,106,42,0.7)",
                zIndex: 4,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 108,
                left: 18,
                width: 74,
                height: 90,
                background: "#f0e8d2",
                transform: "rotate(4deg)",
                boxShadow: "4px 5px 16px rgba(0,0,0,0.6)",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  margin: 6,
                  height: 54,
                  background: "#cdbf9c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 6,
                    color: "#6a5040",
                    textAlign: "center",
                    lineHeight: 1.4,
                    fontFamily: "var(--font-special-elite), monospace",
                  }}
                >
                  YOUR
                  <br />
                  MENTOR?
                </div>
              </div>
              <div
                style={{
                  padding: "2px 6px",
                  fontSize: 5,
                  color: "#3a2a1a",
                  fontFamily: "var(--font-special-elite), monospace",
                }}
              >
                PENDING ID
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 95,
                left: 180,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#4a7878",
                zIndex: 4,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 98,
                left: 116,
                width: 152,
                height: 90,
                background: "#1C1208",
                border: "1px solid rgba(168,106,42,0.35)",
                transform: "rotate(-2deg)",
                boxShadow: "4px 5px 16px rgba(0,0,0,0.6)",
                zIndex: 3,
              }}
            >
              <div style={{ padding: 11 }}>
                <div
                  style={{
                    fontSize: 5,
                    color: "#A86A2A",
                    letterSpacing: 2,
                    marginBottom: 6,
                    fontFamily: "var(--font-special-elite), monospace",
                  }}
                >
                  CIPHER DIVISION
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-cinzel-decorative), serif",
                    fontSize: 12,
                    color: "#D8C0A0",
                    lineHeight: 1.3,
                  }}
                >
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
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: 286,
                pointerEvents: "none",
              }}
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
        <div
          style={{
            position: "absolute",
            bottom: 18,
            right: 24,
            border: "2.5px solid rgba(139,26,26,0.75)",
            padding: "3px 10px",
            transform: "rotate(-6deg)",
            animation: "stampIn 0.9s ease-out 0.5s both",
            zIndex: 6,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-special-elite), monospace",
              fontSize: 12,
              color: "rgba(139,26,26,0.75)",
              letterSpacing: 3,
            }}
          >
            CLASSIFIED
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: 24,
            fontSize: 7,
            color: "rgba(216,192,160,0.35)",
            letterSpacing: 2,
            zIndex: 6,
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          CASE #2026-CSFD
        </div>
      </div>

      {/* Content — centered column, comfortable reading width */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            margin: "0 auto",
            padding: "0 24px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Heading */}
          <div
            style={{
              padding: "28px 0 24px",
              borderBottom: "1px solid rgba(47,36,31,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: "#8b2020",
                  borderRadius: "50%",
                  animation: "pulse 1s step-end infinite",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "#8b2020",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontFamily: "var(--font-special-elite), monospace",
                }}
              >
                Active Investigation
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-cinzel-decorative), serif",
                fontSize: 28,
                color: "#1C1A17",
                lineHeight: 1.3,
                marginBottom: 18,
              }}
            >
              Case Sensitive:
              <br />
              Freshy Day 2026
            </div>
            <div
              style={{
                height: 1,
                background: "rgba(168,106,42,0.25)",
                marginBottom: 18,
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 18,
                color: "#1C1A17",
                lineHeight: 1.75,
              }}
            >
              Seniors have gone undercover. Junior operatives must identify
              their assigned mentor before the deadline.
            </p>
          </div>

          {/* Countdown */}
          <Countdown />

          {/* CTA */}
          <div style={{ paddingBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                color: "#7A6A58",
                letterSpacing: 3,
                textAlign: "center",
                marginBottom: 12,
                fontFamily: "var(--font-special-elite), monospace",
              }}
            >
              — OPERATIVE ACCESS REQUIRED —
            </div>
            <CtaButton />
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              padding: "16px 0 32px",
              textAlign: "center",
              borderTop: "1px solid rgba(47,36,31,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#C4B8A8",
                letterSpacing: 3,
                fontFamily: "var(--font-special-elite), monospace",
              }}
            >
              CSFD27 · SIT · KMUTT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
