import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, XCircle, Wallet } from "lucide-react";
import { listCommitments } from "@/lib/commitments/store";
import { StatusStamp } from "@/components/ui/status-badge";
import { Card, CardHover } from "@/components/ui/card";
import { Sparkline } from "@/components/ui/sparkline";
import { IntegrationStatus } from "@/components/dashboard/integration-status";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const commitments = listCommitments();
  const settled = commitments.filter((c) => c.status === "SETTLED");
  const failed = commitments.filter((c) => c.status === "FAILED");
  const current = commitments.find((c) => !["SETTLED", "FAILED"].includes(c.status));
  const totalSettled = settled.reduce((sum, c) => sum + Number(c.settlement?.amount ?? c.terms.amount), 0);

  const settledSeries = settled
    .slice()
    .reverse()
    .reduce<number[]>((acc, c) => {
      const prev = acc.length ? acc[acc.length - 1] : 0;
      acc.push(prev + Number(c.settlement?.amount ?? c.terms.amount));
      return acc;
    }, []);

  return (
    <div>
      <div className="hero-wash px-6 py-10 sm:px-10 sm:py-14">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-paper-raised">
          Sibyl + Base live
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-display max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Agent commitments, remembered.
          </h1>
          <Link
            href="/demo"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-accent px-5 py-3 text-sm font-medium text-paper-raised transition-colors hover:bg-accent-soft"
          >
            Run the demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <p className="mt-3 max-w-xl text-sm text-ink-soft sm:text-base">
          What every agent promised, delivered, and settled — nothing here is asserted, only remembered.
        </p>
      </div>

      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-xs text-ink-faint">
              <CheckCircle2 className="h-3.5 w-3.5 text-settled" strokeWidth={2} />
              Completed
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold text-ink">{settled.length}</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-xs text-ink-faint">
              <XCircle className="h-3.5 w-3.5 text-failed" strokeWidth={2} />
              Failed
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold text-ink">{failed.length}</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-ink-faint">
                  <Wallet className="h-3.5 w-3.5 text-ink" strokeWidth={2} />
                  Settled (USDC)
                </div>
                <div className="mt-2 font-mono text-3xl font-semibold text-ink">${totalSettled.toFixed(2)}</div>
              </div>
              {settledSeries.length >= 2 && <Sparkline values={settledSeries} width={90} height={40} />}
            </div>
          </Card>
        </div>

        {current && (
          <section className="mt-10">
            <h2 className="text-sm font-medium text-ink-soft">In progress</h2>
            <Link href={`/commitments/${current.id}`} className="mt-3 block">
              <CardHover className="flex items-center justify-between p-5">
                <div>
                  <div className="font-display text-lg font-semibold">
                    Researcher <span className="mx-1 text-ink-faint">→</span>
                    <span>{current.providerId.replace("-", " ")}</span>
                  </div>
                  <div className="mt-1 text-sm text-ink-soft">
                    {current.task.title} · {current.terms.amount} {current.terms.currency}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusStamp status={current.status} />
                  <ArrowUpRight className="h-4 w-4 text-ink-faint" />
                </div>
              </CardHover>
            </Link>
          </section>
        )}

        <section className="mt-10">
          <div className="mb-1 text-xs uppercase tracking-wide text-ink-faint">Where it stands</div>
          <h2 className="font-display text-xl font-bold tracking-tight">What is live, and what is not</h2>
          <div className="mt-4">
            <IntegrationStatus />
          </div>
        </section>

        <section className="mt-10 pb-4">
          <h2 className="text-sm font-medium text-ink-soft">Recent commitments</h2>
          <div className="mt-3 flex flex-col gap-2">
            {commitments.length === 0 && (
              <Card className="px-5 py-8 text-center text-sm text-ink-faint">
                No commitments yet. Run the demo to create the first one.
              </Card>
            )}
            {commitments.map((c) => (
              <Link key={c.id} href={`/commitments/${c.id}`}>
                <CardHover className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                  <span className="w-24 shrink-0 font-mono text-xs text-ink-faint">#{c.id.slice(-5).toUpperCase()}</span>
                  <span className="flex-1 text-sm text-ink-soft">
                    {c.requesterId} <span className="text-ink-faint">→</span> {c.providerId}
                  </span>
                  <span className="text-sm text-ink sm:w-56">{c.task.title}</span>
                  <span className="shrink-0 text-xs text-ink-faint sm:w-32 sm:text-right">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                  <span className="shrink-0 sm:w-32 sm:text-right">
                    <StatusStamp status={c.status} />
                  </span>
                </CardHover>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
