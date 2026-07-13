'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CtaButton() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await fetch('/api/auth/me');
      router.push(res.ok ? '/houses' : '/login');
    } catch {
      router.push('/login');
    } finally {
      setChecking(false);
    }
  }

  return (
    <a
      href="/login"
      onClick={handleClick}
      className="cta-btn"
      style={{
        display: 'block',
        textDecoration: 'none',
        background: '#EDE1C4',
        border: '1px solid rgba(168,106,42,0.3)',
        borderBottom: '2px solid #A86A2A',
        padding: '16px 20px',
        opacity: checking ? 0.7 : 1,
        pointerEvents: checking ? 'none' : 'auto',
        transition: 'opacity 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b2020', animation: 'pulse 1s step-end infinite', flexShrink: 0 }} />
        <div style={{ fontSize: 8, color: '#8b2020', letterSpacing: 3, fontFamily: 'var(--font-special-elite), monospace' }}>NEW OBJECTIVE</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(139,32,32,0.2)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--font-cinzel-decorative), serif', fontSize: 16, color: '#1C1A17', letterSpacing: 1 }}>
          {checking ? 'Verifying...' : 'Begin Investigation'}
        </div>
        <div style={{ fontFamily: 'var(--font-cinzel-decorative), serif', fontSize: 20, color: '#A86A2A', lineHeight: 1 }}>›</div>
      </div>
    </a>
  );
}
