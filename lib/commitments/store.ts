import type { Commitment } from "@/types/commitment";

/**
 * Live commitment records, keyed by id. This is operational state (what is
 * this commitment doing right now), distinct from the memory/service.ts
 * layer, which holds durable historical evidence (what happened before).
 * A commitment moves through here in real time; once it settles or fails,
 * its outcome is what memory/service.ts remembers going forward.
 *
 * Anchored to globalThis: Next.js compiles Route Handlers and Server
 * Components into separate bundles, each with its own module instance, even
 * within the same process. A plain module-scope singleton here would give
 * API routes (which write commitments) and pages (which read them) two
 * different Maps. globalThis is a genuine process-wide global, so it's
 * shared across every bundle.
 */
const globalForCommitments = globalThis as unknown as { __pactCommitments?: Map<string, Commitment> };
const commitments = globalForCommitments.__pactCommitments ?? (globalForCommitments.__pactCommitments = new Map());

export function saveCommitment(commitment: Commitment): Commitment {
  commitments.set(commitment.id, commitment);
  return commitment;
}

export function getCommitment(id: string): Commitment | undefined {
  return commitments.get(id);
}

export function listCommitments(): Commitment[] {
  return [...commitments.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function resetCommitments(): void {
  commitments.clear();
}
