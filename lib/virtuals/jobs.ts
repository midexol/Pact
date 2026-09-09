import { nanoid } from "nanoid";
import { env } from "@/lib/env";
import { demoAgents } from "@/data/agents";
import type { VirtualsClient, VirtualsJobPosting, VirtualsProviderListing } from "./client";

/** Demo discovery: returns the fixed roster of demo agents that match a
 *  skill/category, so the app has real candidates to select between without
 *  a live Virtuals ACP call. */
class DemoVirtualsClient implements VirtualsClient {
  async discoverProviders(category: string): Promise<VirtualsProviderListing[]> {
    return demoAgents
      .filter((a) => a.id !== "researcher" && a.skills.some((s) => s.toLowerCase().includes(category.toLowerCase())))
      .map((a) => ({ agentId: a.id, name: a.name, skills: a.skills }));
  }

  async postJob(_job: VirtualsJobPosting): Promise<{ jobId: string }> {
    return { jobId: `demo_job_${nanoid(8)}` };
  }
}

class LiveVirtualsClient implements VirtualsClient {
  async discoverProviders(_category: string): Promise<VirtualsProviderListing[]> {
    // TODO: replace with the verified Virtuals ACP discovery endpoint/SDK call.
    throw new Error("LiveVirtualsClient.discoverProviders() is not implemented yet");
  }

  async postJob(_job: VirtualsJobPosting): Promise<{ jobId: string }> {
    // TODO: replace with the verified Virtuals ACP job-posting endpoint/SDK call.
    throw new Error("LiveVirtualsClient.postJob() is not implemented yet");
  }
}

let client: VirtualsClient | null = null;

export function getVirtualsClient(): VirtualsClient {
  if (client) return client;
  const canGoLive = !env.DEMO_MODE && env.VIRTUALS_API_KEY && env.VIRTUALS_API_URL;
  client = canGoLive ? new LiveVirtualsClient() : new DemoVirtualsClient();
  return client;
}
