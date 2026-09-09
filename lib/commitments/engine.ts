import { ALLOWED_TRANSITIONS, type Commitment, type CommitmentStatus } from "@/types/commitment";

export class InvalidTransitionError extends Error {
  constructor(from: CommitmentStatus, to: CommitmentStatus) {
    super(`Cannot transition commitment from ${from} to ${to}`);
    this.name = "InvalidTransitionError";
  }
}

export function canTransition(from: CommitmentStatus, to: CommitmentStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Applies a status transition, throwing if it isn't allowed by the state
 *  machine defined in types/commitment.ts. Returns a new Commitment object
 *  (never mutates the input) so callers can persist / broadcast the change. */
export function transition(
  commitment: Commitment,
  to: CommitmentStatus,
  patch: Partial<Commitment> = {}
): Commitment {
  if (!canTransition(commitment.status, to)) {
    throw new InvalidTransitionError(commitment.status, to);
  }
  return { ...commitment, ...patch, status: to };
}

export function isTerminal(status: CommitmentStatus): boolean {
  return ALLOWED_TRANSITIONS[status].length === 0;
}
