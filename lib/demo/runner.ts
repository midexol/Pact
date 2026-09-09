import { nanoid } from "nanoid";
import { createCommitment } from "@/lib/commitments/create";
import { transition } from "@/lib/commitments/engine";
import { saveCommitment, resetCommitments, listCommitments } from "@/lib/commitments/store";
import { remember, resetMemory } from "@/lib/memory/service";
import { selectProvider, type SelectionResult } from "@/lib/agents/selector";
import { getProviderHistory } from "@/lib/agents/history";
import { getPaymentClient } from "@/lib/base/payments";
import { getAgent } from "@/data/agents";
import { DEMO_CATEGORY, DEMO_TASK, DEMO_TERMS, DEMO_FAILURE_REASON, SEED_HISTORY } from "@/data/demo";
import type { Commitment, CommitmentEvent } from "@/types/commitment";

export type DemoStep =
  | "RESET"
  | "CREATE_FAILURE"
  | "FRESH_SESSION"
  | "RECALL"
  | "SELECT"
  | "CREATE_SUCCESS"
  | "SETTLE";

export interface DemoState {
  step: DemoStep;
  message: string;
  failedCommitment?: Commitment;
  successCommitment?: Commitment;
  selection?: SelectionResult;
  sessionId: string;
}

let sessionId = nanoid(8);

async function seedHistory() {
  const now = Date.now();
  for (let i = 0; i < SEED_HISTORY.length; i++) {
    const item = SEED_HISTORY[i];
    const createdAt = new Date(now - (SEED_HISTORY.length - i) * 60_000).toISOString();
    const event: CommitmentEvent = {
      id: `evt_seed_${nanoid(8)}`,
      type: item.success ? "commitment.settled" : "commitment.failed",
      commitmentId: `cmt_seed_${nanoid(8)}`,
      agentId: item.agentId,
      category: DEMO_CATEGORY,
      createdAt,
      payload: {
        title: item.title,
        qualityScore: item.qualityScore,
        reason: item.reason,
      },
    };
    await remember(event);
  }
}

/** RESET — clears live commitment state, wipes remembered evidence, and
 *  reseeds the baseline history so the demo can be replayed from scratch. */
export async function runReset(): Promise<DemoState> {
  resetCommitments();
  await resetMemory();
  await seedHistory();
  sessionId = nanoid(8);
  return {
    step: "RESET",
    message: "Memory and commitments cleared. Baseline provider history reseeded.",
    sessionId,
  };
}

/** CREATE_FAILURE — Analyst A accepts the research commitment and fails it.
 *  The failure is remembered in Sibyl (or its in-memory stand-in) before
 *  the session ends. */
export async function runCreateFailure(): Promise<DemoState> {
  const { commitment, event } = createCommitment({
    requesterId: "researcher",
    providerId: "analyst-a",
    task: DEMO_TASK,
    terms: DEMO_TERMS,
  });
  await remember(event);

  let c = transition(commitment, "ACCEPTED");
  c = transition(c, "IN_PROGRESS");
  c = transition(c, "FAILED", {
    outcome: { success: false, reason: DEMO_FAILURE_REASON, deliveredAt: new Date().toISOString() },
  });
  saveCommitment(c);

  await remember({
    id: `evt_${nanoid(10)}`,
    type: "commitment.failed",
    commitmentId: c.id,
    agentId: "analyst-a",
    category: DEMO_TASK.category,
    createdAt: new Date().toISOString(),
    payload: { title: DEMO_TASK.title, reason: DEMO_FAILURE_REASON },
  });

  return {
    step: "CREATE_FAILURE",
    message: `Analyst A accepted "${DEMO_TASK.title}" and failed it (${DEMO_FAILURE_REASON}). PACT stored the failure.`,
    failedCommitment: c,
    sessionId,
  };
}

/** FRESH_SESSION — ends the visible session and starts a new one. Live
 *  commitment state is cleared; remembered evidence is untouched — this is
 *  the whole point PACT exists to demonstrate. */
export async function runFreshSession(): Promise<DemoState> {
  resetCommitments();
  sessionId = nanoid(8);
  return {
    step: "FRESH_SESSION",
    message: "Session ended. A fresh session has started — persistent memory carries over.",
    sessionId,
  };
}

/** RECALL — the Researcher asks for a research provider again and PACT
 *  retrieves both candidates' comparable history. */
export async function runRecall(): Promise<DemoState> {
  const [a, c] = await Promise.all([
    getProviderHistory("analyst-a", DEMO_TASK.category),
    getProviderHistory("analyst-c", DEMO_TASK.category),
  ]);
  return {
    step: "RECALL",
    message: `Retrieved ${a.events.length + c.events.length} relevant memories for Analyst A and Analyst C.`,
    sessionId,
  };
}

/** SELECT — evidence-based selection between Analyst A and Analyst C. */
export async function runSelect(): Promise<DemoState> {
  const selection = await selectProvider(["analyst-a", "analyst-c"], DEMO_TASK.category);
  return {
    step: "SELECT",
    message: selection.reasoning,
    selection,
    sessionId,
  };
}

/** CREATE_SUCCESS — Analyst C accepts and completes the job. */
export async function runCreateSuccess(): Promise<DemoState> {
  const { commitment, event } = createCommitment({
    requesterId: "researcher",
    providerId: "analyst-c",
    task: DEMO_TASK,
    terms: DEMO_TERMS,
  });
  await remember(event);

  let c = transition(commitment, "ACCEPTED");
  c = transition(c, "IN_PROGRESS");
  c = transition(c, "DELIVERED", {
    outcome: { success: true, qualityScore: 9.4, deliveredAt: new Date().toISOString() },
  });
  c = transition(c, "EVALUATED");
  saveCommitment(c);

  await remember({
    id: `evt_${nanoid(10)}`,
    type: "commitment.evaluated",
    commitmentId: c.id,
    agentId: "analyst-c",
    category: DEMO_TASK.category,
    createdAt: new Date().toISOString(),
    payload: { title: DEMO_TASK.title, qualityScore: 9.4 },
  });

  return {
    step: "CREATE_SUCCESS",
    message: "Analyst C delivered and was evaluated at 9.4/10.",
    successCommitment: c,
    sessionId,
  };
}

/** SETTLE — Base settles the USDC payment; PACT remembers the successful
 *  outcome, updating Analyst C's history for the next selection. */
export async function runSettle(): Promise<DemoState> {
  const agent = getAgent("analyst-c")!;
  const payment = await getPaymentClient().settle({
    toAddress: agent.walletAddress ?? "0x0",
    amount: DEMO_TERMS.amount,
    currency: "USDC",
    reference: DEMO_TASK.title,
  });

  const commitment = mostRecentSuccessCommitment();
  let c = commitment;
  if (c) {
    c = transition(c, "SETTLED", {
      settlement: {
        amount: DEMO_TERMS.amount,
        currency: "USDC",
        status: payment.status === "SETTLED" ? "SETTLED" : "FAILED",
        txHash: payment.txHash,
      },
    });
    saveCommitment(c);
  }

  await remember({
    id: `evt_${nanoid(10)}`,
    type: "commitment.settled",
    commitmentId: c?.id ?? `cmt_${nanoid(10)}`,
    agentId: "analyst-c",
    category: DEMO_TASK.category,
    createdAt: new Date().toISOString(),
    payload: { title: DEMO_TASK.title, qualityScore: 9.4, txHash: payment.txHash },
  });

  return {
    step: "SETTLE",
    message: `Base settled ${DEMO_TERMS.amount} USDC (${payment.txHash}). Analyst C's history now reflects the new success.`,
    successCommitment: c,
    sessionId,
  };
}

function mostRecentSuccessCommitment(): Commitment | undefined {
  // The store only holds the current session's commitments; find the one
  // most recently evaluated for Analyst C.
  return listCommitments().find((c) => c.providerId === "analyst-c" && c.status === "EVALUATED");
}
