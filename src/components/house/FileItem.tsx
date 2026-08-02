import { InkStamp } from "@/components/ui/InkStamp";
import { PAPER_NOISE_URL } from "@/lib/constants/textures";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

export function FileItem({
  href,
  index,
  children,
  color,
  badgeLabel = "File",
  beforeBadge,
  hideBadge = false,
}: {
  index: number;
  children: ReactNode;
  href: string;
  color: string;
  badgeLabel?: string;
  beforeBadge?: ReactNode;
  hideBadge?: boolean;
}) {
  return (
    <div
      className={cn(
        "active:scale-105 duration-300 relative pt-2.5 cursor-pointer hover:rotate-0",
        index == 0
          ? "hover:rotate-1"
          : index % 2 == 0
            ? "rotate-1"
            : "-rotate-1",
      )}
    >
      {/* Folders peeking out behind the top one, suggesting a stack in a drawer */}
      <div
        className="absolute h-3.5 rounded-t-[3px] bg-[#d8c9a0] opacity-90"
        style={{ top: 5, left: 24, right: 20 }}
      />
      <div
        className="absolute h-4 rounded-t-[3px] bg-[#c2ae84] opacity-90"
        style={{ top: 0, left: 14, right: 34 }}
      />
      <div
        className="absolute h-3.5 rounded-t-[3px] opacity-90"
        style={{ top: 18, left: 14, right: 10, backgroundColor: color }}
      />
      <Link
        href={href}
        className="elative isolate mt-3.5 block animate-[fadeIn_0.4s_ease-out_both] bg-[#E0D3AC] no-underline rounded-sm shadow-sm border-muted/50 border"
        // style={{ border: `1px solid rgba(${r},${g},${b},0.22)` }}
      >
        {/* Folder tab */}
        <div
          className="absolute h-[18px] w-16 bg-[#E0D3AC] border-muted/50 border"
          style={{
            top: -16,
            left: 16,
            // border: `1px solid rgba(${r},${g},${b},0.22)`,
            borderBottom: "none",
            borderRadius: "4px 8px 0 0",
          }}
        />

        <div className="px-4 pb-3.5 pt-4">{children}</div>

        {/* Stamp(s) */}
        <div className="absolute right-2 top-2 flex items-center gap-1.5">
          {beforeBadge}
          {!hideBadge && (
            <InkStamp
              rotate={8}
              style={{ fontSize: 8, padding: "2px 6px", letterSpacing: 1.5 }}
            >
              {badgeLabel}
            </InkStamp>
          )}
        </div>

        {/* Paper grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[length:160px_160px] opacity-[0.35] mix-blend-multiply"
          style={{ backgroundImage: `url("${PAPER_NOISE_URL}")` }}
        />
      </Link>
    </div>
  );
}
