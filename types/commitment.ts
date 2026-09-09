export type CommitmentStatus =
  | "PROPOSED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "EVALUATED"
  | "SETTLED"
  | "FAILED"
  | "DISPUTED";

export type CommitmentEventType =
  | "commitment.created"
  | "commitment.accepted"
  | "commitment.started"
  | "commitment.delivered"
  | "commitment.evaluated"
  | "commitment.failed"
  | "commitment.disputed"
  | "commitment.settled";

export interface CommitmentTask {
  title: string;
  description: string;
  requirements: string[];
  category: string;
}

export interface CommitmentTerms {
  amount: string;
  currency: "USDC";
  deadline: string;
}

export interface CommitmentOutcome {
  success: boolean;
  qualityScore?: number;
  reason?: string;
  deliveredAt?: string;
}

export interface CommitmentSettlement {
  amount: string;
  currency: "USDC";
  status: "PENDING" | "SETTLED" | "FAILED";
  txHash?: string;
}

export interface Commitment {
  id: string;
  requesterId: string;
  providerId: string;
  task: CommitmentTask;
  terms: CommitmentTerms;
  status: CommitmentStatus;
  createdAt: string;
  outcome?: CommitmentOutcome;
  settlement?: CommitmentSettlement;
}

/** A single durable record of something that happened to a commitment.
 *  This is the unit PACT persists to Sibyl — the memory, not the opinion. */
export interface CommitmentEvent {
  id: string;
  type: CommitmentEventType;
  commitmentId: string;
  agentId: string;
  category: string;
  createdAt: string;
  payload: Record<string, unknown>;
}

export const ALLOWED_TRANSITIONS: Record<CommitmentStatus, CommitmentStatus[]> = {
  PROPOSED: ["ACCEPTED", "FAILED"],
  ACCEPTED: ["IN_PROGRESS", "FAILED"],
  IN_PROGRESS: ["DELIVERED", "FAILED"],
  DELIVERED: ["EVALUATED"],
  EVALUATED: ["SETTLED", "FAILED"],
  DISPUTED: ["SETTLED", "FAILED"],
  SETTLED: [],
  FAILED: [],
};
