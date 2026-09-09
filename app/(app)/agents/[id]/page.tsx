import { notFound } from "next/navigation";
import Link from "next/link";
import { Wallet, CheckCircle2, XCircle } from "lucide-react";
import { demoAgents, getAgent } from "@/data/agents";
import { getProviderHistory } from "@/lib/agents/history";
import { Card } from "@/components/ui/card";
import { RadialGauge } from "@/components/ui/radial-gauge";
import { Sparkline } from "@/components/ui/sparkline";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return demoAgents.map((a) => ({ id: a.id }));
}

export default async function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = getAgent(id);
  if (!agent) notFound();

  const history = await getProviderHistory(agent.id);
  const recent = [...history.events].reverse().slice(0, 10);

  const qualityTrend = [...history.events]
    .filter((e) => typeof e.payload?.qualityScore === "number")
    .slice(-12)
    .map((e) => e.payload.qualityScore as number);

  return (
    <div className="px-6 py-8 sm:px-10 sm:py-10">
      <div className="flex gap-1 text-sm">
        {demoAgents.map((a) => (
          <Link
            key={a.id}
            href={`/agents/${a.id}`}
            className={cn(
              "rounded-full px-3 py-1.5 transition-colors",
              a.id === agent.id ? "bg-accent text-paper-raised" : "text-ink-faint hover:bg-line-soft hover:text-ink-soft"
            )}
          >
            {a.name}
          </Link>
        ))}
      </div>

      <header className="mt-6 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{agent.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">{agent.description}</p>
          {agent.walletAddress && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-2.5 py-1 font-mono text-xs text-ink-faint">
              <Wallet className="h-3 w-3" strokeWidth={2} />
              {agent.walletAddress}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-4 self-start">
          <RadialGauge
            value={history.completionRate}
            label={`${Math.round(history.completionRate * 100)}%`}
            sublabel="Completion"
            tone={history.completionRate >= 0.9 ? "settled" : history.completionRate < 0.75 ? "failed" : "pending"}
          />
          {history.averageQuality > 0 && (
            <RadialGauge value={history.averageQuality / 10} label={history.averageQuality.toFixed(1)} sublabel="Avg quality" tone="accent" />
          )}
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs text-ink-faint">Commitments</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-ink">{history.totalCommitments}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-1.5 text-xs text-ink-faint">
            <CheckCircle2 className="h-3.5 w-3.5 text-settled" /> Completed
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold text-ink">{history.completed}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-1.5 text-xs text-ink-faint">
            <XCircle className="h-3.5 w-3.5 text-failed" /> Failed
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold text-ink">{history.failed}</div>
        </Card>
      </div>

      {qualityTrend.length >= 2 && (
        <Card className="mt-4 flex items-center justify-between p-5">
          <div>
            <div className="text-xs text-ink-faint">Quality trend (recent)</div>
            <div className="mt-1 font-mono text-lg text-ink">
              {qualityTrend[qualityTrend.length - 1].toFixed(1)}
              <span className="ml-1 text-xs text-ink-faint">/ 10 latest</span>
            </div>
          </div>
          <Sparkline values={qualityTrend} width={140} height={44} />
        </Card>
      )}

      {history.commonFailureReason && (
        <div className="mt-4 rounded-xl border border-line bg-failed-bg px-4 py-3 text-sm text-ink-soft">
          <span className="font-medium text-ink">Common failure:</span> {history.commonFailureReason}
        </div>
      )}

      <section className="mt-10 pb-4">
        <h2 className="text-sm font-medium text-ink-soft">History</h2>
        <div className="mt-3 flex flex-col gap-2">
          {recent.length === 0 && (
            <Card className="px-5 py-8 text-center text-sm text-ink-faint">No remembered history yet.</Card>
          )}
          {recent.map((e) => (
            <Card key={e.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="flex-1 text-ink-soft">{String(e.payload?.title ?? e.type)}</span>
              <span className="w-40 shrink-0 text-right text-xs text-ink-faint">
                {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}
              </span>
              <span className="w-28 shrink-0 text-right font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
                {e.type === "commitment.settled" ? "SUCCESS" : e.type === "commitment.failed" ? "FAILED" : e.type.split(".")[1]}
              </span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
