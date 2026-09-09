import { getProviderHistory, type ProviderHistorySummary } from "./history";

export interface CandidateVerdict {
  agentId: string;
  history: ProviderHistorySummary;
  score: number;
}

export interface SelectionResult {
  selected: CandidateVerdict;
  rejected: CandidateVerdict[];
  reasoning: string;
}

/**
 * Evidence-based provider selection.
 *
 * Deliberately not an LLM call: PACT's thesis is that historical evidence,
 * not model improvisation, should decide who gets the next job. A score is
 * computed from each candidate's remembered completion rate and average
 * quality for the task's category, and the highest score wins. Ties fall
 * back to whoever has completed more comparable work.
 */
export async function selectProvider(
  candidateIds: string[],
  category: string
): Promise<SelectionResult> {
  const histories = await Promise.all(
    candidateIds.map((id) => getProviderHistory(id, category))
  );

  const candidates: CandidateVerdict[] = histories.map((history) => ({
    agentId: history.agentId,
    history,
    score: scoreHistory(history),
  }));

  candidates.sort((a, b) => b.score - a.score || b.history.completed - a.history.completed);

  const [selected, ...rejected] = candidates;
  const reasoning = buildReasoning(selected, rejected);

  return { selected, rejected, reasoning };
}

function scoreHistory(history: ProviderHistorySummary): number {
  if (history.totalCommitments === 0) return 0.5; // neutral prior, no evidence either way
  return history.completionRate * 0.7 + (history.averageQuality / 10) * 0.3;
}

function buildReasoning(selected: CandidateVerdict, rejected: CandidateVerdict[]): string {
  const lines: string[] = [];
  for (const r of rejected) {
    if (r.history.totalCommitments === 0) {
      lines.push(`${r.agentId} has no comparable history.`);
    } else {
      lines.push(
        `${r.agentId}: ${r.history.completed}/${r.history.totalCommitments} completed ` +
          `(${Math.round(r.history.completionRate * 100)}%)` +
          (r.history.commonFailureReason ? `, common failure: ${r.history.commonFailureReason}.` : ".")
      );
    }
  }
  if (selected.history.totalCommitments > 0) {
    lines.push(
      `${selected.agentId}: ${selected.history.completed}/${selected.history.totalCommitments} ` +
        `completed (${Math.round(selected.history.completionRate * 100)}%), ` +
        `avg quality ${selected.history.averageQuality.toFixed(1)} — selected.`
    );
  } else {
    lines.push(`${selected.agentId}: no comparable history — selected as the neutral default.`);
  }
  return lines.join(" ");
}
