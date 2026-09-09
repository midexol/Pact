import type { CommitmentEvent } from "@/types/commitment";
import type { MemoryQuery, MemoryStore } from "@/lib/memory/types";
import { env } from "@/lib/env";

/**
 * Sibyl adapter.
 *
 * sibyl-memory-client (docs.sibyllabs.org/memory) is a local, file-based
 * Python SDK over SQLite — there is no hosted HTTP API for a Next.js app to
 * call directly, and its CLI/MCP surface only exposes read-only
 * search/recall/list. So this adapter talks to a tiny local sidecar
 * (sibyl-sidecar/) that wraps the real MemoryClient and exposes exactly
 * two endpoints PACT needs: POST /remember and GET /recall.
 *
 * Verified against the actual sibyl_memory_client 0.8.0 source (pulled from
 * PyPI, not guessed from docs): each CommitmentEvent is written with
 * set_entity(category=agentId, name=event.id, body=event). Sibyl enforces
 * UNIQUE (tenant_id, category, name) at the schema level, and
 * list_entities(category=agentId) is a direct, indexed filter by provider —
 * which is exactly PACT's access pattern (see sibyl-sidecar/main.py for the
 * full mapping and why the journal tier doesn't fit).
 */
export class SibylMemoryStore implements MemoryStore {
  private sidecarUrl: string;

  constructor() {
    if (!env.SIBYL_SIDECAR_URL) {
      throw new Error("SibylMemoryStore requires SIBYL_SIDECAR_URL (see sibyl-sidecar/README)");
    }
    this.sidecarUrl = env.SIBYL_SIDECAR_URL;
  }

  async remember(event: CommitmentEvent): Promise<void> {
    const res = await fetch(`${this.sidecarUrl}/remember`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!res.ok) {
      throw new Error(`Sibyl sidecar remember() failed: ${res.status} ${await res.text()}`);
    }
  }

  async recall(query: MemoryQuery): Promise<CommitmentEvent[]> {
    const params = new URLSearchParams();
    if (query.agentId) params.set("agentId", query.agentId);
    if (query.category) params.set("category", query.category);
    if (query.task) params.set("task", query.task);

    const res = await fetch(`${this.sidecarUrl}/recall?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Sibyl sidecar recall() failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as { events: CommitmentEvent[] };
    return data.events;
  }

  async reset(): Promise<void> {
    // Sibyl is durable, real memory — there is intentionally no "wipe
    // everything" endpoint on the sidecar. Demo resets only clear session
    // state, never persisted history, once this adapter is live.
    throw new Error("SibylMemoryStore does not support reset() — that's the point.");
  }
}
