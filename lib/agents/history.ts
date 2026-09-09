import { recall } from "@/lib/memory/service";
import type { CommitmentEvent } from "@/types/commitment";

export interface ProviderHistorySummary {
  agentId: string;
  category?: string;
  totalCommitments: number;
  completed: number;
  failed: number;
  completionRate: number;
  averageQuality: number;
  commonFailureReason?: string;
  events: CommitmentEvent[];
}

/** Pulls every remembered event for an agent (optionally scoped to one task
 *  category) and reduces it to the evidence a selector or a judge can read
 *  at a glance. This is where PACT turns raw memory into a verdict — no
 *  LLM guessing, just a reduction over what actually happened. */
export async function getProviderHistory(
  agentId: string,
  category?: string
): Promise<ProviderHistorySummary> {
  const events = await recall({ agentId, category });
  const settled = events.filter(
    (e) => e.type === "commitment.settled" || e.type === "commitment.failed"
  );

  const completed = settled.filter((e) => e.type === "commitment.settled").length;
  const failed = settled.filter((e) => e.type === "commitment.failed").length;
  const total = completed + failed;

  const qualityScores = settled
    .map((e) => e.payload?.qualityScore)
    .filter((q): q is number => typeof q === "number");

  const failureReasons = settled
    .filter((e) => e.type === "commitment.failed")
    .map((e) => String(e.payload?.reason ?? ""))
    .filter(Boolean);

  const commonFailureReason = mostCommon(failureReasons);

  return {
    agentId,
    category,
    totalCommitments: total,
    completed,
    failed,
    completionRate: total > 0 ? completed / total : 0,
    averageQuality:
      qualityScores.length > 0
        ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
        : 0,
    commonFailureReason,
    events,
  };
}

function mostCommon(values: string[]): string | undefined {
  if (values.length === 0) return undefined;
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}
