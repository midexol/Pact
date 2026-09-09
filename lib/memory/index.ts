import type { CommitmentEvent } from "@/types/commitment";
import type { MemoryQuery, MemoryStore } from "./types";

/**
 * Temporary in-memory implementation of MemoryStore.
 *
 * This exists to prove the application architecture end-to-end before the
 * verified Sibyl SDK/API is wired in (see lib/sibyl/client.ts). It is a
 * process-lifetime singleton, so "persistence" here means "survives a
 * fresh session" (a new UI session / new agent conversation) but not a
 * server restart — which is exactly the behavior the demo needs: a
 * "Start New Session" click clears visible session state while this store
 * keeps remembering.
 */
class InMemoryMemoryStore implements MemoryStore {
  private events: CommitmentEvent[] = [];

  async remember(event: CommitmentEvent): Promise<void> {
    this.events.push(event);
  }

  async recall(query: MemoryQuery): Promise<CommitmentEvent[]> {
    return this.events
      .filter((e) => {
        if (query.agentId && e.agentId !== query.agentId) return false;
        if (query.category && e.category !== query.category) return false;
        if (query.task) {
          const payloadTitle = String(e.payload?.title ?? "").toLowerCase();
          if (!payloadTitle.includes(query.task.toLowerCase())) return false;
        }
        return true;
      })
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async reset(): Promise<void> {
    this.events = [];
  }
}

// Anchored to globalThis, not a plain module-scope singleton: Next.js
// compiles Route Handlers and Server Components into separate bundles, each
// with its own module instance, even within the same process. A plain
// singleton here would give API routes and pages two different stores (see
// lib/commitments/store.ts for the same fix and full explanation).
const globalForMemory = globalThis as unknown as { __pactMemoryStore?: MemoryStore };
export const memoryStore: MemoryStore =
  globalForMemory.__pactMemoryStore ?? (globalForMemory.__pactMemoryStore = new InMemoryMemoryStore());
