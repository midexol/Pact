export interface VirtualsJobPosting {
  requesterId: string;
  category: string;
  title: string;
  description: string;
  requirements: string[];
  budget: { amount: string; currency: "USDC" };
}

export interface VirtualsProviderListing {
  agentId: string;
  name: string;
  skills: string[];
}

/**
 * Virtuals adapter — the boundary where PACT hands a commitment to the
 * agent-commerce layer. lib/virtuals/jobs.ts provides a DEMO_MODE-aware
 * implementation backed by data/agents.ts so agent discovery works without
 * live Virtuals ACP credentials. Fill in the two calls below against the
 * verified Virtuals ACP SDK/API once VIRTUALS_API_KEY / VIRTUALS_API_URL
 * are set. If Virtuals integration becomes blocked, this adapter boundary
 * is what stays — keep the internal demo agents responsible for
 * deterministic execution behind it (per the build plan's fallback
 * strategy).
 */
export interface VirtualsClient {
  discoverProviders(category: string): Promise<VirtualsProviderListing[]>;
  postJob(job: VirtualsJobPosting): Promise<{ jobId: string }>;
}
