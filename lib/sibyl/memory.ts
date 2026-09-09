import { env } from "@/lib/env";
import { SibylMemoryStore } from "./client";
import type { MemoryStore } from "@/lib/memory/types";

let instance: MemoryStore | null = null;

/** Returns a shared SibylMemoryStore instance, or null if the sidecar isn't
 *  configured yet (no SIBYL_SIDECAR_URL, or DEMO_MODE is on). */
export function getSibylMemoryStore(): MemoryStore | null {
  if (env.DEMO_MODE) return null;
  if (!env.SIBYL_SIDECAR_URL) return null;
  if (!instance) instance = new SibylMemoryStore();
  return instance;
}
