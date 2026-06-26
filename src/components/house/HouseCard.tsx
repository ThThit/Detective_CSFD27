import Link from 'next/link';
import { HOUSE_META } from '@/lib/constants/houses';
import type { HouseKey } from '@/types';

type HouseCardProps = {
  houseKey: HouseKey;
  memberCount: number;
  onClick?: () => void;
};

function HouseIcon({ houseKey, color }: { houseKey: HouseKey; color: string }): JSX.Element {
  switch (houseKey) {
    case 'tracer':
      return <div style={{ width: 13, height: 13, background: color, borderRadius: '50%' }} />;
    case 'noir':
      return <div style={{ width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: `15px solid ${color}` }} />;
    case 'foxlock':
      return (
        <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 6, height: 6, background: color, borderRadius: '50%' }} />
        </div>
      );
    case 'cipher':
      return (
        <div style={{ position: 'relative', width: 16, height: 22 }}>
          <div style={{ position: 'absolute', bottom: 0, width: 16, height: 14, border: `2.5px solid ${color}` }} />
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 10, height: 9, border: `2.5px solid ${color}`, borderRadius: '5px 5px 0 0', background: '#E5E0CF' }} />
        </div>
      );
  }
}

export function HouseCard({ houseKey, memberCount, onClick }: HouseCardProps) {
  const meta = HOUSE_META[houseKey];
  const [r, g, b] = meta.rgb;

  return (
    <Link
      href={`/houses/${houseKey}`}
      onClick={onClick}
      className="house-card"
      style={{
        background: '#E5E0CF',
        border: `1px solid rgba(${r},${g},${b},0.22)`,
        display: 'block',
        textDecoration: 'none',
        overflow: 'hidden',
        animation: 'fadeIn 0.4s ease-out both',
      }}
    >
      {/* Color band */}
      <div style={{ height: 5, background: meta.color }} />

      <div style={{ padding: '16px 16px 14px' }}>

        {/* Icon */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          border: `1.5px solid rgba(${r},${g},${b},0.35)`,
          background: `rgba(${r},${g},${b},0.07)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          <HouseIcon houseKey={houseKey} color={meta.color} />
        </div>

        {/* Name */}
        <div style={{ fontFamily: 'var(--font-cinzel-decorative), serif', fontSize: 14, color: meta.color, marginBottom: 5, lineHeight: 1.3 }}>
          {meta.name}
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 14, color: '#7A6A58', lineHeight: 1.5, marginBottom: 14, fontStyle: 'italic', fontFamily: 'var(--font-cormorant-garamond), serif' }}>
          {meta.tagline}
        </div>

        {/* Member count */}
        <div style={{ fontSize: 11, color: meta.color, letterSpacing: 1, fontFamily: 'var(--font-special-elite), monospace', opacity: 0.85 }}>
          {memberCount} AGENTS
        </div>

      </div>
    </Link>
  );
}
