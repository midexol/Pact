import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getCommitment } from "@/lib/commitments/store";
import { StatusStamp } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CommitmentStatus } from "@/types/commitment";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

const PIPELINE: CommitmentStatus[] = [
  "PROPOSED",
  "ACCEPTED",
  "IN_PROGRESS",
  "DELIVERED",
  "EVALUATED",
  "SETTLED",
];

export default async function CommitmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const commitment = getCommitment(id);
  if (!commitment) notFound();

  const failedAt = commitment.status === "FAILED";
  const currentIndex = PIPELINE.indexOf(commitment.status);
  const steps = failedAt ? PIPELINE.slice(0, 3).concat("FAILED" as CommitmentStatus) : PIPELINE;

  return (
    <div className="px-6 py-8 sm:px-10 sm:py-10">
      <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="font-mono text-xs text-ink-faint">COMMITMENT #{commitment.id.slice(-5).toUpperCase()}</div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {commitment.requesterId} <span className="text-ink-faint">→</span> {commitment.providerId}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{commitment.task.title}</p>
        </div>
        <StatusStamp status={commitment.status} className="text-sm" />
      </header>

      <div className="mt-6 grid grid-cols-3 gap-4 text-sm sm:gap-6">
        <div>
          <div className="text-xs text-ink-faint">Amount</div>
          <div className="mt-1 font-mono text-ink">
            {commitment.terms.amount} {commitment.terms.currency}
          </div>
        </div>
        <div>
          <div className="text-xs text-ink-faint">Deadline</div>
          <div className="mt-1 text-ink-soft">{format(new Date(commitment.terms.deadline), "MMM d, HH:mm")}</div>
        </div>
        <div>
          <div className="text-xs text-ink-faint">Category</div>
          <div className="mt-1 text-ink-soft">{commitment.task.category}</div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-ink-soft">Requirements</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {commitment.task.requirements.map((r) => (
            <li key={r} className="rounded-lg border border-line bg-paper-raised px-3.5 py-2 text-sm text-ink-soft">
              {r}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-ink-soft">Pipeline</h2>
        <div className="mt-5 flex items-start overflow-x-auto pb-2">
          {steps.map((status, i, arr) => {
            const reached = failedAt ? true : i <= currentIndex;
            const isFailed = status === "FAILED";
            return (
              <div key={status} className="flex min-w-[64px] flex-1 items-start last:min-w-0 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full border-2",
                      reached ? (isFailed ? "border-failed bg-failed" : "border-accent bg-accent") : "border-line bg-transparent"
                    )}
                  />
                  <span className={cn("whitespace-nowrap text-[10px] uppercase tracking-[0.06em]", reached ? "text-ink-soft" : "text-ink-faint")}>
                    {status.replace("_", " ")}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className={cn("mx-1 mt-[5px] h-0.5 flex-1 rounded-full", reached && i < currentIndex ? "bg-accent" : "bg-line")} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {commitment.outcome && (
        <Card className={cn("mt-8 p-5", commitment.outcome.success ? "bg-settled-bg" : "bg-failed-bg")}>
          <h2 className="text-sm font-medium text-ink-soft">Outcome</h2>
          <p className="mt-2 text-sm text-ink">
            {commitment.outcome.success ? "Delivered successfully." : `Failed — ${commitment.outcome.reason}.`}
            {commitment.outcome.qualityScore && ` Quality: ${commitment.outcome.qualityScore.toFixed(1)}/10.`}
          </p>
        </Card>
      )}

      {commitment.settlement && (
        <Card className="mt-4 bg-settled-bg p-5">
          <h2 className="text-sm font-medium text-ink-soft">Settlement</h2>
          <p className="mt-2 font-mono text-sm text-ink">
            {commitment.settlement.amount} {commitment.settlement.currency} — {commitment.settlement.status}
          </p>
          {commitment.settlement.txHash && (
            <a
              href={
                commitment.settlement.txHash.startsWith("demo_")
                  ? undefined
                  : `https://sepolia.basescan.org/tx/${commitment.settlement.txHash}`
              }
              target={commitment.settlement.txHash.startsWith("demo_") ? undefined : "_blank"}
              rel="noreferrer"
              className={cn(
                "mt-2 inline-flex items-center gap-1.5 break-all font-mono text-xs text-ink-faint",
                !commitment.settlement.txHash.startsWith("demo_") && "hover:text-ink"
              )}
            >
              {commitment.settlement.txHash}
              {!commitment.settlement.txHash.startsWith("demo_") && <ExternalLink className="h-3 w-3 shrink-0" />}
            </a>
          )}
        </Card>
      )}
    </div>
  );
}
