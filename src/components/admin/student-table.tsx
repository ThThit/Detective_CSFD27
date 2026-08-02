'use client';

import Link from 'next/link';

const TOTAL_ATTEMPTS = 3;

type Pair = {
  id: string;
  senior: { id: string; studentId: string; displayName: string; nickname: string | null };
  junior: { id: string; studentId: string; displayName: string; nickname: string | null; guessLeft: number };
  foundAt: string | null;
};

function PersonCell({
  id,
  displayName,
  nickname,
}: {
  id: string;
  displayName: string;
  nickname: string | null;
}) {
  return (
    <div style={{ fontFamily: "'Special Elite', monospace", letterSpacing: '0.5px', minWidth: 0, overflow: 'hidden' }}>
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <Link href={`/agent/${id}`} style={{ color: '#1C1A17', fontSize: '11px', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          {nickname ?? displayName}
        </Link>
      </div>
      {nickname && (
        <div style={{ color: '#A0907E', fontSize: '9px', fontStyle: 'italic', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayName}
        </div>
      )}
    </div>
  );
}

export type Filter = 'all' | 'solved' | 'open' | 'failed';

type StudentTableProps = {
  pairs: Pair[];
  filter: Filter;
};

export function StudentTable({ pairs, filter }: StudentTableProps) {
  const filtered = pairs.filter((p) => {
    const failed = p.foundAt === null && p.junior.guessLeft <= 0;
    if (filter === 'solved') return p.foundAt !== null;
    if (filter === 'failed') return failed;
    if (filter === 'open') return p.foundAt === null && !failed;
    return true;
  });

  return (
    <div>
      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) 50px 60px', columnGap: '16px',
        padding: '9px 16px', borderBottom: '1px solid rgba(47,36,31,0.1)',
        background: '#E0D3AC', position: 'sticky', top: 0,
      }}>
        {['SENIOR', 'JUNIOR', 'ATTEMPTS', 'STATUS'].map((h) => (
          <div key={h} style={{ fontFamily: "'Special Elite', monospace", fontSize: '7px', color: '#A0907E', letterSpacing: '2px' }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      {filtered.map((pair, i) => {
        const solved = pair.foundAt !== null;
        const failed = !solved && pair.junior.guessLeft <= 0;
        // guessLeft only decrements on a wrong guess, so add 1 for the
        // successful guess itself when solved.
        const attemptsUsed =
          TOTAL_ATTEMPTS - pair.junior.guessLeft + (solved ? 1 : 0);
        const statusColor = solved ? '#3a6a2a' : failed ? '#2F241F' : '#8b2020';
        const statusLabel = solved ? 'SOLVED' : failed ? 'FAILED' : 'OPEN';
        return (
          <div key={pair.id} style={{
            display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) 50px 60px', columnGap: '16px',
            padding: '12px 16px', borderBottom: '1px solid rgba(47,36,31,0.05)',
            alignItems: 'center',
            background: i % 2 === 1 ? 'rgba(47,36,31,0.02)' : 'transparent',
            animation: `fadeIn 0.3s ease-out ${i * 0.04}s both`,
          }}>
            <PersonCell id={pair.senior.id} displayName={pair.senior.displayName} nickname={pair.senior.nickname} />
            <PersonCell id={pair.junior.id} displayName={pair.junior.displayName} nickname={pair.junior.nickname} />
            <div style={{
              fontFamily: "'Special Elite', monospace", fontSize: '10px', letterSpacing: '0.5px',
              color: attemptsUsed >= TOTAL_ATTEMPTS ? '#8b2020' : '#1C1A17',
            }}>
              {attemptsUsed}/{TOTAL_ATTEMPTS}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: statusColor }} />
              <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '9px', letterSpacing: '1px', color: statusColor }}>
                {statusLabel}
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ padding: '16px', textAlign: 'center', fontFamily: "'Special Elite', monospace", fontSize: '9px', color: '#C4B8A8', letterSpacing: '3px' }}>
        SHOWING {filtered.length} OF {pairs.length} PAIRS
      </div>

      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}
