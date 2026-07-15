'use client';

import { useEffect, useState } from 'react';

const TARGET = new Date('2026-08-08T14:00:00+07:00');

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  const p = (n: number) => String(n).padStart(2, '0');
  return {
    days: p(Math.floor(diff / 86400000)),
    hours: p(Math.floor((diff % 86400000) / 3600000)),
    minutes: p(Math.floor((diff % 3600000) / 60000)),
    seconds: p(Math.floor((diff % 60000) / 1000)),
  };
}

function Sep() {
  return <div style={{ fontFamily: 'var(--font-cinzel-decorative), serif', fontSize: 42, color: '#A0907E', lineHeight: 1, padding: '0 2px' }}>:</div>;
}

export default function Countdown() {
  const [time, setTime] = useState({ days: '--', hours: '--', minutes: '--', seconds: '--' });

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ margin: '20px 0', background: '#E0D3AC', border: '1px solid rgba(168,106,42,0.28)' }}>

      {/* Header row */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(168,106,42,0.18)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, background: '#8b2020', borderRadius: '50%', animation: 'pulse 1s step-end infinite', flexShrink: 0 }} />
        <div style={{ fontSize: 11, color: '#8b2020', letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'var(--font-special-elite), monospace' }}>Case Deadline</div>
      </div>

      {/* Numbers */}
      <div style={{ padding: '24px 16px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 2 }}>
        <div style={{ textAlign: 'center', minWidth: 60 }}>
          <div style={{ fontFamily: 'var(--font-cinzel-decorative), serif', fontSize: 42, color: '#1C1A17', lineHeight: 1 }}>{time.days}</div>
          <div style={{ fontSize: 10, color: '#7A6A58', letterSpacing: 3, marginTop: 6, fontFamily: 'var(--font-special-elite), monospace' }}>DAYS</div>
        </div>
        <Sep />
        <div style={{ textAlign: 'center', minWidth: 60 }}>
          <div style={{ fontFamily: 'var(--font-cinzel-decorative), serif', fontSize: 42, color: '#1C1A17', lineHeight: 1 }}>{time.hours}</div>
          <div style={{ fontSize: 10, color: '#7A6A58', letterSpacing: 3, marginTop: 6, fontFamily: 'var(--font-special-elite), monospace' }}>HRS</div>
        </div>
        <Sep />
        <div style={{ textAlign: 'center', minWidth: 56 }}>
          <div style={{ fontFamily: 'var(--font-cinzel-decorative), serif', fontSize: 42, color: '#1C1A17', lineHeight: 1 }}>{time.minutes}</div>
          <div style={{ fontSize: 10, color: '#7A6A58', letterSpacing: 3, marginTop: 6, fontFamily: 'var(--font-special-elite), monospace' }}>MIN</div>
        </div>
        <Sep />
        <div style={{ textAlign: 'center', minWidth: 56 }}>
          <div style={{ fontFamily: 'var(--font-cinzel-decorative), serif', fontSize: 42, color: '#A86A2A', lineHeight: 1 }}>{time.seconds}</div>
          <div style={{ fontSize: 10, color: '#7A6A58', letterSpacing: 3, marginTop: 6, fontFamily: 'var(--font-special-elite), monospace' }}>SEC</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 20px 16px', textAlign: 'center', fontSize: 10, color: '#7A6A58', letterSpacing: 2, fontFamily: 'var(--font-special-elite), monospace' }}>
        TARGET: 08 AUG 2026 · 14:00 ICT
      </div>
    </div>
  );
}
