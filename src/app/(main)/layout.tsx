"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "DIVISIONS", href: "/houses" },
  { label: "STATS", href: "/admin/dashboard" },
  { label: "ME", href: "/agent" },
];

function BottomTabs() {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 flex bg-surface border-t border-dark/10">
      {navLinks.map((nav) => (
        <Link
          key={nav.href}
          href={nav.href}
          className="flex-1 py-[11px] pb-[12px] text-center no-underline border-r border-dark/6 block"
        >
          <div
            className={cn(
              "w-3.5 h-[1.5px] mx-auto mb-1",
              pathname.startsWith(nav.href) ? "bg-accent" : "bg-transparent",
            )}
          />

          <div
            className={cn(
              "text-[9px] tracking-[1.5px] font-mono",
              pathname.startsWith(nav.href) ? "text-accent" : "text-muted",
            )}
          >
            {nav.label}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BottomTabs />
    </>
  );
}
