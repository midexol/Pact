import { nanoid } from "nanoid";
import type {
  Commitment,
  CommitmentEvent,
  CommitmentTask,
  CommitmentTerms,
} from "@/types/commitment";

export interface CreateCommitmentInput {
  requesterId: string;
  providerId: string;
  task: CommitmentTask;
  terms: CommitmentTerms;
}

export function createCommitment(input: CreateCommitmentInput): {
  commitment: Commitment;
  event: CommitmentEvent;
} {
  const now = new Date().toISOString();
  const commitment: Commitment = {
    id: `cmt_${nanoid(10)}`,
    requesterId: input.requesterId,
    providerId: input.providerId,
    task: input.task,
    terms: input.terms,
    status: "PROPOSED",
    createdAt: now,
  };

  const event: CommitmentEvent = {
    id: `evt_${nanoid(10)}`,
    type: "commitment.created",
    commitmentId: commitment.id,
    agentId: input.providerId,
    category: input.task.category,
    createdAt: now,
    payload: {
      title: input.task.title,
      requesterId: input.requesterId,
      providerId: input.providerId,
      amount: input.terms.amount,
    },
  };

  return { commitment, event };
}
