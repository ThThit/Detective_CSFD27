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
      if (res.ok) {
        router.push('/houses');
      } else {
        window.location.href = '/api/auth/login';
      }
    } catch {
      window.location.href = '/api/auth/login';
    } finally {
      setChecking(false);
    }
  }

  return (
    <a
      href="/api/auth/login"
      onClick={handleClick}
      className={`cta-btn block no-underline bg-background border border-accent/30 border-b-2 border-b-accent px-5 py-4 transition-opacity duration-150 ${checking ? 'opacity-70 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-danger animate-[pulse_1s_step-end_infinite] shrink-0" />
        <div className="text-[8px] text-danger tracking-[3px] font-mono">NEW OBJECTIVE</div>
        <div className="flex-1 h-px bg-danger/20" />
      </div>
      <div className="flex items-center justify-between">
        <div className="font-display text-base text-foreground tracking-[1px]">
          {checking ? 'Verifying...' : 'Begin Investigation'}
        </div>
        <div className="font-display text-xl text-accent leading-none">›</div>
      </div>
    </a>
  );
}
