 'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { StudentTable, type Filter } from '@/components/admin/student-table';

type Pair = {
  id: string;
  senior: { id: string; studentId: string; displayName: string; nickname: string | null };
  junior: { id: string; studentId: string; displayName: string; nickname: string | null; guessLeft: number };
  foundAt: string | null;
  createdAt: string;
};

const VALID_FILTERS: Filter[] = ['all', 'solved', 'open', 'failed'];

function isFilter(value: string | null): value is Filter {
  return value !== null && (VALID_FILTERS as string[]).includes(value);
}

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pairs, setPairs] = useState<Pair[]>([]);
  const [loading, setLoading] = useState(true);

  const statusParam = searchParams.get('status');
  const filter: Filter = isFilter(statusParam) ? statusParam : 'all';

  useEffect(() => {
    fetch('/api/pcodes')
      .then((r) => r.json())
      .then((data) => setPairs(data.pairs ?? []))
      .finally(() => setLoading(false));
  }, []);

  function setFilter(f: Filter) {
    const params = new URLSearchParams(searchParams.toString());
    if (f === 'all') {
      params.delete('status');
    } else {
      params.set('status', f);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const total  = pairs.length;
  const solved = pairs.filter((p) => p.foundAt !== null).length;
  const failed = pairs.filter((p) => p.foundAt === null && p.junior.guessLeft <= 0).length;
  const open   = pairs.filter((p) => p.foundAt === null && p.junior.guessLeft > 0).length;

  const filterBtn = (f: Filter) => ({
    fontFamily: "'Special Elite', monospace",
    fontSize: '8px', letterSpacing: '2px', cursor: 'pointer',
    padding: '7px 0', flex: 1, textAlign: 'center' as const,
    background: filter === f ? 'rgba(168,106,42,0.1)' : 'transparent',
    border: `1px solid ${filter === f ? 'rgba(168,106,42,0.35)' : 'rgba(47,36,31,0.12)'}`,
    color: filter === f ? '#A86A2A' : '#7A6A58',
  });

  const statTile = (f: Filter) => ({
    padding: '14px 16px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    background: filter === f ? 'rgba(168,106,42,0.08)' : 'transparent',
  });

  return (
    <div style={{ background: '#EDE1C4', minHeight: '100vh', fontFamily: "'Cormorant Garamond', serif" }}>

      {/* Header */}
      <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid rgba(47,36,31,0.08)' }}>
        <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '8px', color: '#8b2020', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '6px' }}>
          ACTIVE OPERATION
        </div>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '18px', color: '#1C1A17', lineHeight: 1.2 }}>
          Mentor Pairings
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(47,36,31,0.08)', background: '#E0D3AC' }}>
        <div onClick={() => setFilter('all')} style={{ ...statTile('all'), borderRight: '1px solid rgba(47,36,31,0.06)' }}>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '26px', color: '#1C1A17', lineHeight: 1 }}>{total}</div>
          <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '7px', color: '#A0907E', letterSpacing: '2px', marginTop: '4px' }}>TOTAL</div>
        </div>
        <div onClick={() => setFilter('open')} style={{ ...statTile('open'), borderRight: '1px solid rgba(47,36,31,0.06)' }}>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '26px', color: '#8b2020', lineHeight: 1 }}>{open}</div>
          <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '7px', color: '#A0907E', letterSpacing: '2px', marginTop: '4px' }}>OPEN</div>
        </div>
        <div onClick={() => setFilter('solved')} style={{ ...statTile('solved'), borderRight: '1px solid rgba(47,36,31,0.06)' }}>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '26px', color: '#3a6a2a', lineHeight: 1 }}>{solved}</div>
          <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '7px', color: '#A0907E', letterSpacing: '2px', marginTop: '4px' }}>SOLVED</div>
        </div>
        <div onClick={() => setFilter('failed')} style={statTile('failed')}>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '26px', color: '#2F241F', lineHeight: 1 }}>{failed}</div>
          <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '7px', color: '#A0907E', letterSpacing: '2px', marginTop: '4px' }}>FAILED</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(47,36,31,0.08)', display: 'flex', gap: '6px' }}>
        <div onClick={() => setFilter('all')} style={filterBtn('all')}>ALL</div>
        <div onClick={() => setFilter('open')} style={filterBtn('open')}>OPEN</div>
        <div onClick={() => setFilter('solved')} style={filterBtn('solved')}>SOLVED</div>
        <div onClick={() => setFilter('failed')} style={filterBtn('failed')}>FAILED</div>
      </div>

      {/* Table */}
      {loading
        ? <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Special Elite', monospace", fontSize: '9px', color: '#C4B8A8', letterSpacing: '3px' }}>LOADING...</div>
        : <StudentTable pairs={pairs} filter={filter} />
      }

    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
