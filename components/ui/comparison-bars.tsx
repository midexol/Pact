import { cn } from "@/lib/utils";

interface ComparisonRow {
  label: string;
  value: number;
  displayValue: string;
  highlighted?: boolean;
}

/** Two-series horizontal bar comparison. Color follows the entity being
 *  highlighted (accent ink) vs. the baseline (neutral gray) — not a
 *  judgment-coded hue pair — with the value direct-labeled at the bar end
 *  rather than relying on a separate legend. */
export function ComparisonBars({ rows, max }: { rows: ComparisonRow[]; max?: number }) {
  const scaleMax = max ?? Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => {
        const pct = Math.max(0, Math.min(1, row.value / scaleMax)) * 100;
        return (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className={cn("font-medium", row.highlighted ? "text-ink" : "text-ink-soft")}>{row.label}</span>
              <span className={cn("font-mono", row.highlighted ? "text-ink" : "text-ink-faint")}>{row.displayValue}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-line-soft">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%`, background: row.highlighted ? "var(--accent)" : "var(--ink-faint)" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
