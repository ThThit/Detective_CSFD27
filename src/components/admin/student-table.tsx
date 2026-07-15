'use client';

type Pair = {
  id: string;
  senior: { studentId: string; displayName: string };
  junior: { studentId: string; displayName: string; guessLeft: number };
  foundAt: string | null;
};

function maskId(id: string) {
  return `${id.slice(0, 2)}xx${id.slice(-2)}`;
}

type StudentTableProps = {
  pairs: Pair[];
  filter: 'all' | 'solved' | 'open';
};

export function StudentTable({ pairs, filter }: StudentTableProps) {
  const filtered = pairs.filter((p) => {
    if (filter === 'solved') return p.foundAt !== null;
    if (filter === 'open') return p.foundAt === null;
    return true;
  });

  return (
    <div>
      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 80px',
        padding: '9px 16px', borderBottom: '1px solid rgba(47,36,31,0.1)',
        background: '#E0D3AC', position: 'sticky', top: 0,
      }}>
        {['SENIOR', 'JUNIOR', 'STATUS'].map((h) => (
          <div key={h} style={{ fontFamily: "'Special Elite', monospace", fontSize: '7px', color: '#A0907E', letterSpacing: '2px' }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      {filtered.map((pair, i) => {
        const solved = pair.foundAt !== null;
        return (
          <div key={pair.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 80px',
            padding: '12px 16px', borderBottom: '1px solid rgba(47,36,31,0.05)',
            alignItems: 'center',
            background: i % 2 === 1 ? 'rgba(47,36,31,0.02)' : 'transparent',
            animation: `fadeIn 0.3s ease-out ${i * 0.04}s both`,
          }}>
            <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '11px', color: '#1C1A17', letterSpacing: '0.5px' }}>
              {pair.senior.displayName} <span style={{ color: '#A0907E', fontSize: '9px' }}>({maskId(pair.senior.studentId)})</span>
            </div>
            <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '11px', color: '#1C1A17', letterSpacing: '0.5px' }}>
              {pair.junior.displayName} <span style={{ color: '#A0907E', fontSize: '9px' }}>({maskId(pair.junior.studentId)})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: solved ? '#3a6a2a' : '#8b2020' }} />
              <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '9px', letterSpacing: '1px', color: solved ? '#3a6a2a' : '#8b2020' }}>
                {solved ? 'SOLVED' : 'OPEN'}
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
