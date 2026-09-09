import { cn } from "@/lib/utils";

const TONE_BG: Record<"settled" | "failed" | "pending", string> = {
  settled: "bg-settled",
  failed: "bg-failed",
  pending: "bg-pending",
};

/** A single-row ratio bar — completion rate / quality. */
export function Bar({ value, tone = "settled", className }: { value: number; tone?: "settled" | "failed" | "pending"; className?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-line-soft", className)}>
      <div className={cn("h-full rounded-full transition-[width] duration-500 ease-out", TONE_BG[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}
