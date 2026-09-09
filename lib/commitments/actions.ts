import { getCommitment, saveCommitment } from "./store";
import { transition, InvalidTransitionError } from "./engine";
import { remember } from "@/lib/memory/service";
import { nanoid } from "nanoid";
import type { Commitment, CommitmentEventType, CommitmentStatus } from "@/types/commitment";

export interface ActionInput {
  qualityScore?: number;
  reason?: string;
  txHash?: string;
}

const ACTION_STATUS: Record<string, CommitmentStatus> = {
  accept: "ACCEPTED",
  start: "IN_PROGRESS",
  deliver: "DELIVERED",
  evaluate: "EVALUATED",
  fail: "FAILED",
  settle: "SETTLED",
};

const ACTION_EVENT: Record<string, CommitmentEventType> = {
  accept: "commitment.accepted",
  start: "commitment.started",
  deliver: "commitment.delivered",
  evaluate: "commitment.evaluated",
  fail: "commitment.failed",
  settle: "commitment.settled",
};

export class CommitmentNotFoundError extends Error {}

/** Applies one of the six commitment actions (accept/start/deliver/
 *  evaluate/fail/settle): validates the state-machine transition, updates
 *  the live commitment record, and remembers the corresponding event. */
export async function applyAction(
  commitmentId: string,
  action: keyof typeof ACTION_STATUS,
  input: ActionInput = {}
): Promise<Commitment> {
  const commitment = getCommitment(commitmentId);
  if (!commitment) throw new CommitmentNotFoundError(commitmentId);

  const patch: Partial<Commitment> = {};
  if (action === "deliver") {
    patch.outcome = { success: true, qualityScore: input.qualityScore, deliveredAt: new Date().toISOString() };
  }
  if (action === "fail") {
    patch.outcome = { success: false, reason: input.reason, deliveredAt: new Date().toISOString() };
  }
  if (action === "settle") {
    patch.settlement = {
      amount: commitment.terms.amount,
      currency: "USDC",
      status: "SETTLED",
      txHash: input.txHash,
    };
  }

  const updated = transition(commitment, ACTION_STATUS[action], patch);
  saveCommitment(updated);

  await remember({
    id: `evt_${nanoid(10)}`,
    type: ACTION_EVENT[action],
    commitmentId: updated.id,
    agentId: updated.providerId,
    category: updated.task.category,
    createdAt: new Date().toISOString(),
    payload: {
      title: updated.task.title,
      qualityScore: input.qualityScore,
      reason: input.reason,
      txHash: input.txHash,
    },
  });

  return updated;
}

export { InvalidTransitionError };
