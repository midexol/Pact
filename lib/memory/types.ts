import type { CommitmentEvent } from "@/types/commitment";

export interface MemoryQuery {
  agentId?: string;
  task?: string;
  category?: string;
}

/**
 * MemoryStore is the one boundary PACT's business logic depends on for
 * persistence. lib/memory/index.ts ships a temporary in-memory
 * implementation so the rest of the app (engine, selector, API routes) can
 * be built and tested first. lib/sibyl/client.ts implements this same
 * interface against the verified Sibyl SDK/API — swapping it in should
 * require no changes anywhere else in the application.
 */
export interface MemoryStore {
  remember(event: CommitmentEvent): Promise<void>;
  recall(query: MemoryQuery): Promise<CommitmentEvent[]>;
  /** Wipes all stored events. Demo-mode only — lets the judging demo start
   *  from a clean slate without restarting the server. */
  reset(): Promise<void>;
}
