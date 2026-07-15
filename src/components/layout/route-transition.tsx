"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="flex flex-col flex-1" style={{ animation: "fadeIn 0.35s ease-out both" }}>
      {children}
    </div>
  );
}
