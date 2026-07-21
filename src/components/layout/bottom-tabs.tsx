"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DivisionsIcon } from "@/components/icons/DivisionsIcon";
import { ProfileIcon } from "@/components/icons/ProfileIcon";

const baseNavLinks = [
  { label: "DIVISIONS", href: "/houses" },
  { label: "STATS", href: "/admin/dashboard", adminOnly: true },
  { label: "ME", href: "/agent/me" },
];

const SHRINK_THRESHOLD = 40;

export function BottomTabs({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const navLinks = baseNavLinks.filter((nav) => !nav.adminOnly || isAdmin);
  const [shrunk, setShrunk] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    function handleScroll(event: Event) {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const target = event.target;
        const scrollTop =
          target instanceof Document
            ? (target.scrollingElement?.scrollTop ?? 0)
            : target instanceof HTMLElement
              ? target.scrollTop
              : 0;

        if (scrollTop <= SHRINK_THRESHOLD) {
          setShrunk(false);
        } else if (scrollTop > lastScrollY.current) {
          setShrunk(true);
        } else if (scrollTop < lastScrollY.current) {
          setShrunk(false);
        }

        lastScrollY.current = scrollTop;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const activeIndex = navLinks.findIndex((nav) => pathname.startsWith(nav.href));

  return (
    <div
      className={cn(
        "fixed w-11/12 max-w-[720px] rounded-full left-1/2 -translate-x-1/2 bottom-4 shadow-sm flex bg-surface border border-dark/20 origin-bottom transition-all duration-200 ease-out",
        shrunk ? "scale-80" : "scale-100 opacity-100",
      )}
    >
      {activeIndex >= 0 && (
        <div
          className="absolute inset-y-0.5 left-0.5 rounded-full bg-accent transition-transform duration-200 ease-out"
          style={{
            width: `calc(${100 / navLinks.length}% - 1.5px)`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      )}
      {navLinks.map((nav) => {
        const isActive = pathname.startsWith(nav.href)
        return (
          <Link
            key={nav.href}
            href={nav.href}
            className={cn(
              "relative z-10 flex-1 w-full py-2.5 text-center no-underline block transition-transform duration-150 active:scale-95",
              isActive ? "text-white" : "text-accent"
            )}
          >
            {/*<div
                        className={cn(
                            "w-3.5 h-[1.5px] mx-auto mb-1 transition-colors duration-150",
                            pathname.startsWith(nav.href) ? "bg-accent" : "bg-transparent",
                        )}
                    />*/}

            <div
              className={cn(
                "-mb-0.5 flex items-center justify-center gap-1 text-[12px] tracking-[1.5px] font-mono transition-colors duration-150",
                // pathname.startsWith(nav.href) ? "text-accent" : "text-muted",
              )}
            >
              {nav.href === "/houses" && (
                <DivisionsIcon className="w-4 pb-1 h-4 shrink-0" />
              )}
              {nav.href === "/agent/me" && (
                <ProfileIcon className="w-4 pb-1 h-4 shrink-0" />
              )}
              {nav.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
