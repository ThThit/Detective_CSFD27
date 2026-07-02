'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Hint } from '@/types';

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
};

const TOTAL_ATTEMPTS = 3;

export function AccusationTerminal({
  initialGuessLeft,
  initialIsFound,
  initialHints,
}: AccusationTerminalProps) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [guessLeft, setGuessLeft] = useState(initialGuessLeft);
  const [isFound, setIsFound] = useState(initialIsFound);
  const [errorMsg, setErrorMsg] = useState('');
  const [shaking, setShaking] = useState(false);
  const [solvedSenior, setSolvedSenior] = useState<SolvedSenior | null>(null);
  const [loading, setLoading] = useState(false);
  const [solvedAt] = useState(() => new Date());

  const attemptsUsed = TOTAL_ATTEMPTS - guessLeft;

  async function handleSubmit() {
    if (loading) return;
    if (!/^\d{10}$/.test(input)) {
      setErrorMsg('ID must be exactly 10 digits.');
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.');
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
          `Wrong ID. That operative remains at large. ${newLives} chance${newLives !== 1 ? 's' : ''} remaining.`,
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
    const houseLabel = (senior?.house ?? '').toUpperCase();
    const closedDate = solvedAt.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    }).toUpperCase();
    const closedTime = solvedAt.toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit',
    });

    return (
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#F3EEE5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        boxSizing: 'border-box',
        textAlign: 'center',
        animation: 'overlayIn 0.4s ease-out both',
      }}>
        {/* Stamp */}
        <div style={{
          border: '3px solid #3a6a2a',
          padding: '7px 24px',
          marginBottom: '20px',
          display: 'inline-block',
          animation: 'closedStamp 0.8s ease-out both',
        }}>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '20px', color: '#3a6a2a', letterSpacing: '3px' }}>
            CASE CLOSED
          </div>
        </div>

        <div style={{ fontSize: '8px', color: '#3a6a2a', letterSpacing: '4px', marginBottom: '4px', fontFamily: "'Special Elite', monospace", animation: 'revealUp 0.5s ease-out 0.3s both', opacity: 0 }}>
          CONFESSION SEALED
        </div>
        <div style={{ fontSize: '8px', color: '#A0907E', letterSpacing: '3px', marginBottom: '28px', fontFamily: "'Special Elite', monospace", animation: 'revealUp 0.5s ease-out 0.4s both', opacity: 0 }}>
          OPERATIVE IDENTIFIED
        </div>

        {/* Identity card */}
        <div style={{
          background: '#E5E0CF',
          border: '1px solid rgba(58,106,42,0.3)',
          padding: '22px 20px',
          width: '100%',
          maxWidth: '360px',
          boxSizing: 'border-box',
          marginBottom: '18px',
          animation: 'revealUp 0.5s ease-out 0.5s both',
          opacity: 0,
        }}>
          <div style={{ fontSize: '7px', color: '#A0907E', letterSpacing: '3px', marginBottom: '14px', fontFamily: "'Special Elite', monospace" }}>
            SENIOR OPERATIVE REVEALED
          </div>

          {/* Photo */}
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: senior?.profileUrl ? 'transparent' : '#F3EEE5',
            border: '2px solid rgba(58,106,42,0.35)',
            margin: '0 auto 14px',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {senior?.profileUrl
              ? <img src={senior.profileUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '7px', color: '#A0907E', fontFamily: "'Special Elite', monospace", textAlign: 'center', lineHeight: 1.3 }}>PHOTO</span>
            }
          </div>

          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '17px', color: '#1C1A17', marginBottom: '4px', lineHeight: 1.2 }}>
            {senior?.displayName ?? '—'}
          </div>
          {senior?.nickname && (
            <div style={{ fontSize: '13px', color: '#A86A2A', marginBottom: '14px', letterSpacing: '1px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
              Alias: <strong>{senior.nickname}</strong>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: senior?.nickname ? 0 : '14px' }}>
            <div style={{ padding: '3px 8px', background: 'rgba(168,106,42,0.1)', border: '1px solid rgba(168,106,42,0.3)', fontSize: '8px', color: '#A86A2A', letterSpacing: '1px', fontFamily: "'Special Elite', monospace" }}>
              {houseLabel}
            </div>
            <div style={{ padding: '3px 8px', background: 'rgba(58,106,42,0.1)', border: '1px solid rgba(58,106,42,0.3)', fontSize: '8px', color: '#3a6a2a', letterSpacing: '1px', fontFamily: "'Special Elite', monospace" }}>
              IDENTIFIED
            </div>
          </div>
        </div>

        {/* Case reference */}
        <div style={{
          fontSize: '9px', color: '#C4B8A8', letterSpacing: '2px', lineHeight: 1.9,
          marginBottom: '22px', fontFamily: "'Special Elite', monospace",
          animation: 'revealUp 0.5s ease-out 0.6s both', opacity: 0,
        }}>
          CASE #2027-CSFD-{houseLabel.slice(0, 3)}-CLOSED<br />
          CLOSED: {closedDate} · {closedTime} ICT<br />
          ATTEMPTS USED: {attemptsUsed + 1} OF {TOTAL_ATTEMPTS}
        </div>

        <button
          onClick={() => router.refresh()}
          style={{
            background: '#2F241F', padding: '14px 24px', cursor: 'pointer',
            width: '100%', maxWidth: '360px', border: 'none',
            animation: 'revealUp 0.5s ease-out 0.7s both', opacity: 0,
          }}
        >
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '13px', color: '#D8C0A0', letterSpacing: '2px' }}>
            Return to Profile
          </div>
        </button>
      </div>
    );
  }

  // ── Expired state ───────────────────────────────────────────────────────────
  if (guessLeft === 0 && !isFound) {
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ background: 'rgba(139,32,32,0.06)', border: '1px solid rgba(139,32,32,0.15)', padding: '24px 20px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '18px', color: '#8b2020', letterSpacing: '2px', marginBottom: '10px' }}>
            CASE EXPIRED
          </div>
          <div style={{ fontSize: '14px', color: '#7A6A58', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', lineHeight: 1.6 }}>
            This operative has evaded identification.
          </div>
        </div>

        {initialHints.length > 0 && (
          <>
            <div style={{ fontSize: '8px', color: '#A0907E', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: "'Special Elite', monospace" }}>
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
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: '8px', color: '#8b2020', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px', fontFamily: "'Special Elite', monospace' " }}>
        ▸ ACTIVE CASE
      </div>

      {/* Terminal block */}
      <div style={{ background: '#E5E0CF', border: '1px solid rgba(139,32,32,0.2)', overflow: 'hidden', marginBottom: '24px' }}>
        {/* Header row */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(139,32,32,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', background: '#8b2020', borderRadius: '50%', animation: 'pulse 1s step-end infinite' }} />
            <div style={{ fontSize: '8px', color: '#8b2020', letterSpacing: '3px', fontFamily: "'Special Elite', monospace" }}>
              SUSPECT ID TERMINAL
            </div>
          </div>

          {/* Tally marks + counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {Array.from({ length: TOTAL_ATTEMPTS }).map((_, i) => {
                const used = i < attemptsUsed;
                return (
                  <div key={i} style={{ position: 'relative', width: '10px', height: '22px' }}>
                    <div style={{ position: 'absolute', top: 0, left: '4px', width: '2px', height: '22px', background: used ? '#8b2020' : '#2F241F', borderRadius: '1px', opacity: used ? 0.6 : 1 }} />
                    {used && (
                      <div style={{ position: 'absolute', top: '50%', left: 0, width: '10px', height: '2px', background: 'rgba(139,32,32,0.5)', transform: 'translateY(-50%) rotate(-20deg)', borderRadius: '1px' }} />
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '11px', color: '#1C1A17', fontFamily: "'Cinzel Decorative', serif" }}>
              {guessLeft} <span style={{ fontSize: '10px', color: '#A0907E' }}>/ {TOTAL_ATTEMPTS}</span>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '9px', color: '#A0907E', letterSpacing: '2px', marginBottom: '8px', fontFamily: "'Special Elite', monospace" }}>
            ENTER SENIOR STUDENT ID:
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            background: '#F3EEE5',
            border: `1px solid ${errorMsg ? 'rgba(139,32,32,0.4)' : 'rgba(168,106,42,0.22)'}`,
            animation: shaking ? 'shake 0.4s ease-out' : 'none',
          }}>
            <div style={{ padding: '10px', fontSize: '11px', color: '#A86A2A', borderRight: '1px solid rgba(168,106,42,0.18)', display: 'flex', alignItems: 'center', fontFamily: "'Special Elite', monospace" }}>
              ›_
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="65XXXXXXXX"
              value={input}
              maxLength={10}
              onChange={e => { setInput(e.target.value); setErrorMsg(''); }}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
              disabled={loading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: "'Special Elite', monospace",
                fontSize: '18px',
                color: '#1C1A17',
                padding: '8px 12px',
                caretColor: '#A86A2A',
                letterSpacing: '3px',
              }}
            />
          </div>

          {errorMsg && (
            <div style={{ marginTop: '8px', background: 'rgba(139,32,32,0.06)', border: '1px solid rgba(139,32,32,0.2)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '4px', height: '4px', background: '#8b2020', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: '#8b2020', lineHeight: 1.5, fontFamily: "'Cormorant Garamond', serif" }}>
                {errorMsg}
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#5a3838' : '#8b2020',
            padding: '14px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '11px', color: '#F3EEE5', letterSpacing: '4px' }}>
            {loading ? 'TRANSMITTING...' : 'SUBMIT ACCUSATION ›'}
          </div>
          <div style={{ fontSize: '8px', color: 'rgba(243,238,229,0.4)', marginTop: '3px', letterSpacing: '2px', fontFamily: "'Special Elite', monospace" }}>
            IRREVERSIBLE
          </div>
        </button>
      </div>

      {/* Evidence section */}
      {initialHints.length > 0 && (
        <>
          <div style={{ fontSize: '8px', color: '#A0907E', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: "'Special Elite', monospace" }}>
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
  const revealDate = new Date(hint.revealDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short',
  }).toUpperCase();

  return (
    <div style={{ background: '#E5E0CF', border: '1px solid rgba(58,106,42,0.3)', marginBottom: '8px', overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(58,106,42,0.15)', background: 'rgba(58,106,42,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '5px', height: '5px', background: '#3a6a2a', borderRadius: '50%' }} />
          <div style={{ fontSize: '8px', color: '#3a6a2a', letterSpacing: '2px', fontFamily: "'Special Elite', monospace" }}>
            HINT {index + 1} · REVEALED
          </div>
        </div>
        <div style={{ fontSize: '8px', color: '#A0907E', letterSpacing: '1px', fontFamily: "'Special Elite', monospace" }}>
          {revealDate}
        </div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: '14px', color: '#2F241F', lineHeight: 1.65, fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>
          &ldquo;{hint.content}&rdquo;
        </div>
      </div>
    </div>
  );
}
