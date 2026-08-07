'use client';

import { useEffect, useRef, useState } from 'react';
import { GUESS_DEADLINE } from '@/lib/constants/deadline';

const TARGET = GUESS_DEADLINE;

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
  return (
    <div className="self-center -mt-3 px-px font-display text-xl text-muted-fg">
      :
    </div>
  );
}

const digitClass =
  'absolute inset-x-0 top-0 h-16 text-center font-display text-[40px] text-background leading-[64px]';

function FlipUnit({ value, label }: { value: string; label: string }) {
  const [oldValue, setOldValue] = useState(value);
  const [bottomValue, setBottomValue] = useState(value);
  const [epoch, setEpoch] = useState(0);
  const prevRef = useRef(value);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      prevRef.current = value;
      return;
    }
    if (value === prevRef.current) return;

    const old = prevRef.current;
    prevRef.current = value;
    setOldValue(old);
    setEpoch((e) => e + 1);

    const t = setTimeout(() => setBottomValue(value), 300);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="text-center">
      <div className="relative w-[52px] h-16">
        {/* static back halves: top always shows the current value, bottom
            lags behind until the bottom leaf is about to cover it */}
        <div className="absolute inset-x-0 top-0 h-8 overflow-hidden bg-[#231f1a] rounded-t">
          <span className={digitClass}>{value}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-8 overflow-hidden bg-[#231f1a] rounded-b">
          <span className={`${digitClass} top-[-32px]`}>{bottomValue}</span>
        </div>

        <div className="absolute inset-x-0.5 top-1/2 h-px bg-black/40 z-[5]" />

        {/* animated leaves, each clipped by a non-transformed wrapper so the
            rotating leaf can never bleed past its own half during the flip */}
        <div className="absolute inset-x-0 top-0 h-8 overflow-hidden rounded-t z-[3] [perspective:220px]">
          <div
            key={`top-${epoch}`}
            className={`absolute inset-0 overflow-hidden bg-[#231f1a] rounded-t origin-bottom [backface-visibility:hidden]${epoch > 0 ? ' flip-leaf-top' : ''}`}
          >
            <span className={digitClass}>{oldValue}</span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-8 overflow-hidden rounded-b z-[3] [perspective:220px]">
          <div
            key={`bottom-${epoch}`}
            className={`absolute inset-0 overflow-hidden bg-[#231f1a] rounded-b origin-top [backface-visibility:hidden] shadow-[inset_0_-6px_10px_rgba(0,0,0,0.25)]${epoch > 0 ? ' flip-leaf-bottom' : ''}`}
          >
            <span className={`${digitClass} top-[-32px]`}>{value}</span>
          </div>
        </div>
      </div>
      <div className="mt-1.5 font-mono text-[10px] text-muted tracking-[3px]">
        {label}
      </div>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState({ days: '--', hours: '--', minutes: '--', seconds: '--' });

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="my-4 bg-surface border border-accent/28">

      {/* Header row */}
      <div className="px-5 py-3 pb-2.5 border-b border-accent/18 flex items-center gap-2.5">
        {/*<div className="w-2 h-2 bg-danger rounded-full animate-[pulse_1s_step-end_infinite] shrink-0" />*/}
        <div className="text-[11px] text-danger tracking-[3px] uppercase font-mono">Case Deadline</div>
      </div>

      {/* Flip digits */}
      <div className="px-4 pt-4 pb-2.5 flex items-start justify-center gap-1.5">
        <FlipUnit value={time.days} label="DAYS" />
        <Sep />
        <FlipUnit value={time.hours} label="HRS" />
        <Sep />
        <FlipUnit value={time.minutes} label="MIN" />
        <Sep />
        <FlipUnit value={time.seconds} label="SEC" />
      </div>

      {/* Footer */}
      {/*<div className="px-5 pt-2.5 pb-4 text-center text-[10px] text-muted tracking-[2px] font-mono">
        TARGET: 08 AUG 2026 · 14:00 ICT
      </div>*/}
    </div>
  );
}
