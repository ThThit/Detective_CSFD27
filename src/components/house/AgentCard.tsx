import { cn } from "@/lib/utils";

interface AgentCardProps {
  name: string;
  guessCount: number;
  solved: boolean;
  className?: string;
}

export function AgentCard({ name, guessCount, solved, className }: AgentCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900",
        className
      )}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{name}</span>
        <span className="text-xs text-zinc-500">{guessCount} guesses</span>
      </div>
      <span
        className={cn(
          "rounded-full px-2.5 py-0.5 text-xs font-medium",
          solved
            ? "bg-emerald-100 text-emerald-700"
            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        )}
      >
        {solved ? "Solved" : "Unsolved"}
      </span>
    </div>
  );
}
