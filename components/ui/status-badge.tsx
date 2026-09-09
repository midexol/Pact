import { cn } from "@/lib/utils";
import type { CommitmentStatus } from "@/types/commitment";

const STATUS_STYLES: Record<CommitmentStatus, { bg: string; dot: string }> = {
  PROPOSED: { bg: "bg-line-soft", dot: "bg-ink-faint" },
  ACCEPTED: { bg: "bg-pending-bg", dot: "bg-pending" },
  IN_PROGRESS: { bg: "bg-pending-bg", dot: "bg-pending" },
  DELIVERED: { bg: "bg-pending-bg", dot: "bg-pending" },
  EVALUATED: { bg: "bg-pending-bg", dot: "bg-pending" },
  SETTLED: { bg: "bg-settled-bg", dot: "bg-settled" },
  FAILED: { bg: "bg-failed-bg", dot: "bg-failed" },
  DISPUTED: { bg: "bg-disputed-bg", dot: "bg-disputed" },
};

/** Status identity lives in the dot, never in colored text — labels stay in
 *  neutral ink so the chip reads clearly regardless of the status hue's
 *  contrast against a light surface. */
export function StatusStamp({ status, className }: { status: CommitmentStatus; className?: string }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-soft",
        s.bg,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {status.replace("_", " ")}
    </span>
  );
}
