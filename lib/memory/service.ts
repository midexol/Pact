import type { CommitmentEvent } from "@/types/commitment";
import { memoryStore as inMemoryStore } from "./index";
import { getSibylMemoryStore } from "@/lib/sibyl/memory";
import type { MemoryQuery } from "./types";

/**
 * Every other module (engine, selector, API routes) imports from here, not
 * from lib/memory/index.ts or lib/sibyl/client.ts directly. This is what
 * lets the app run entirely on the in-memory store in DEMO_MODE and switch
 * to the real Sibyl adapter with zero call-site changes once it's wired in.
 */
function activeStore() {
  return getSibylMemoryStore() ?? inMemoryStore;
}

export async function remember(event: CommitmentEvent): Promise<void> {
  return activeStore().remember(event);
}

export async function recall(query: MemoryQuery): Promise<CommitmentEvent[]> {
  return activeStore().recall(query);
}

export async function resetMemory(): Promise<void> {
  return inMemoryStore.reset();
}
