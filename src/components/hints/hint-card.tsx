import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { House } from "@/lib/constants/houses";

interface HintCardProps {
  content: string;
  targetHouse: House;
  usedAt?: string | null;
  className?: string;
}

export function HintCard({ content, targetHouse, usedAt, className }: HintCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{content}</p>
        <Badge house={targetHouse}>{targetHouse}</Badge>
      </div>
      {usedAt && (
        <p className="mt-2 text-xs text-zinc-400">
          Used {new Date(usedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
