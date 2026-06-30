"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type NavbarProps = {
  user?: {
    house: string, nickname: string | null;
  } | null;
};

const tabs = [
  { label: 'DIVISIONS', href: '/houses' },
  { label: 'AGENT', href: '/agent' },
  { label: 'STATS', href: '/admin/dashboard' },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  return (
    <>
      {/* Top bar */}
      <nav style={{ background: '#E5E0CF', borderBottom: '1px solid rgba(47,36,31,0.14)' }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-12">
        <Link href="/houses" style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '15px', color: '#2F241F', letterSpacing: '1px' }}>
          CSFD27
        </Link>
        {user?.house && (
          <Badge house={user.house as 'tracer' | 'noir' | 'foxlock' | 'cipher'} size="md">
            {user.house}
          </Badge>
        )}
      </nav>

      {/* Spacer so content isn't hidden under top bar */}
      <div className="h-12" />

      {/* Bottom tabs */}
      <nav style={{ background: '#E5E0CF', borderTop: '1px solid rgba(47,36,31,0.1)', paddingBottom: '1px' }}
        className="fixed bottom-0 left-0 right-0 z-50 flex">
        {tabs.map((tab, i) => {
          const isActive = pathname === tab.href;
          const isLast = i === tabs.length - 1;
          return (
            <Link href={tab.href} key={tab.href}
              className="flex-1 flex flex-col items-center text-center"
              style={{
                padding: '9px 0 10px',
                fontFamily: "'Special Elite', monospace",
                fontSize: '9px',
                fontWeight: 'bold',
                letterSpacing: '1.5px',
                color: isActive ? '#A86A2A' : '#7A6A58',
                opacity: isActive ? 1 : 0.7,
                borderRight: isLast ? 'none' : '1px solid rgba(47,36,31,0.06)',
                textDecoration: 'none',
              }}>
              {isActive && (
                <span style={{ width: '14px', height: '1.5px', background: '#A86A2A', display: 'block', margin: '0 auto 4px' }} />
              )}
              {tab.label}
              {isActive && (
                <span style={{ width: '14px', height: '1.5px', background: '#A86A2A', display: 'block', margin: '4px auto 0' }} />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
  