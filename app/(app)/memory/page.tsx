import Link from "next/link";
import { recall } from "@/lib/memory/service";
import { getProviderHistory } from "@/lib/agents/history";
import { DEMO_CATEGORY } from "@/data/demo";
import { Card } from "@/components/ui/card";
import { ComparisonBars } from "@/components/ui/comparison-bars";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function MemoryTracePage({
  searchParams,
}: {
  searchParams: Promise<{ agentId?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category ?? DEMO_CATEGORY;

  const [analystA, analystC, events] = await Promise.all([
    getProviderHistory("analyst-a", category),
    getProviderHistory("analyst-c", category),
    recall({ agentId: sp.agentId, category: sp.agentId ? undefined : category }),
  ]);

  const hasEvidence = analystA.totalCommitments > 0 || analystC.totalCommitments > 0;
  const EVENT_LIMIT = 30;
  const visibleEvents = events.slice(-EVENT_LIMIT).reverse();
  const hiddenCount = Math.max(0, events.length - EVENT_LIMIT);

  return (
    <div className="px-6 py-8 sm:px-10 sm:py-10">
      <header>
        <div className="mb-1 text-xs uppercase tracking-wide text-ink-faint">Sibyl memory</div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Memory trace</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          How PACT turns remembered outcomes into a provider decision, for &ldquo;{category}&rdquo;.
        </p>
      </header>

      {hasEvidence && (
        <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-ink-faint">ANALYST A</span>
              <span className="font-mono text-xs text-failed">
                {analystA.failed} failure{analystA.failed === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-2 font-mono text-2xl font-semibold text-ink-soft">
              {analystA.completed}/{analystA.totalCommitments}
              <span className="ml-2 text-sm font-normal text-ink-faint">completed</span>
            </div>
          </Card>
          <Card className="border-ink/10 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-ink">ANALYST C</span>
              <span className="font-mono text-xs text-settled">avg {analystC.averageQuality.toFixed(1)}/10</span>
            </div>
            <div className="mt-2 font-mono text-2xl font-semibold text-ink">
              {analystC.completed}/{analystC.totalCommitments}
              <span className="ml-2 text-sm font-normal text-ink-faint">completed</span>
            </div>
          </Card>

          <Card className="p-5 sm:col-span-2">
            <div className="mb-4 text-xs text-ink-faint">Completion rate</div>
            <ComparisonBars
              max={1}
              rows={[
                { label: "Analyst A", value: analystA.completionRate, displayValue: `${Math.round(analystA.completionRate * 100)}%` },
                {
                  label: "Analyst C",
                  value: analystC.completionRate,
                  displayValue: `${Math.round(analystC.completionRate * 100)}%`,
                  highlighted: true,
                },
              ]}
            />
          </Card>
        </section>
      )}

      <section className="mt-10 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink-soft">
            {sp.agentId ? `Events for ${sp.agentId}` : "All remembered events"}{" "}
            <span className="text-ink-faint">
              ({hiddenCount > 0 ? `latest ${visibleEvents.length} of ${events.length}` : events.length})
            </span>
          </h2>
          {sp.agentId && (
            <Link href="/memory" className="text-xs text-ink-faint hover:text-ink">
              Clear filter
            </Link>
          )}
        </div>
        <div className="mt-3 flex max-h-[560px] flex-col gap-1.5 overflow-y-auto rounded-xl border border-line p-1">
          {events.length === 0 && (
            <Card className="border-none px-5 py-8 text-center text-sm text-ink-faint">
              Nothing remembered yet — run the demo to create the first evidence.
            </Card>
          )}
          {visibleEvents.map((e) => (
            <div key={e.id} className="flex items-center gap-4 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-line-soft">
              <span className="w-36 shrink-0 font-mono text-[11px] text-ink-faint">
                {format(new Date(e.createdAt), "MMM d HH:mm:ss")}
              </span>
              <Link href={`/memory?agentId=${e.agentId}`} className="w-20 shrink-0 text-ink-soft hover:text-ink">
                {e.agentId}
              </Link>
              <span
                className={cn(
                  "w-28 shrink-0 font-mono text-[11px] uppercase tracking-[0.06em]",
                  e.type === "commitment.settled" ? "text-settled" : e.type === "commitment.failed" ? "text-failed" : "text-pending"
                )}
              >
                {e.type.split(".")[1]}
              </span>
              <span className="flex-1 truncate text-ink-soft">{String(e.payload?.title ?? "")}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
