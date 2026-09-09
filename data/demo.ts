import type { CommitmentTask, CommitmentTerms } from "@/types/commitment";

export const DEMO_CATEGORY = "base ecosystem research";

export const DEMO_TASK: CommitmentTask = {
  title: "Base ecosystem research",
  description:
    "Produce a research report covering the current state of the Base ecosystem: notable protocols, TVL trends, and emerging categories.",
  requirements: [
    "At least 5 primary sources",
    "TVL and volume figures with citations",
    "A short outlook section",
  ],
  category: DEMO_CATEGORY,
};

export const DEMO_TERMS: CommitmentTerms = {
  amount: "10",
  currency: "USDC",
  deadline: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
};

export const DEMO_FAILURE_REASON = "incomplete sourcing";

/** Comparable prior jobs used to seed Analyst A / Analyst C's history so
 *  the selector has real evidence to reason over the first time the demo
 *  runs, matching the "Example historical evidence" in the build plan:
 *  Analyst A 8/11 completed (72%), Analyst C 12/12 completed (100%, avg 9.4). */
export const SEED_HISTORY: {
  agentId: string;
  title: string;
  success: boolean;
  qualityScore?: number;
  reason?: string;
}[] = [
  // Analyst A: 8 completed, 3 failed (this task's category included, so the
  // demo's live failure becomes the 4th, comparable failure).
  { agentId: "analyst-a", title: "Base research", success: false, reason: DEMO_FAILURE_REASON },
  { agentId: "analyst-a", title: "Market research", success: true, qualityScore: 6.5 },
  { agentId: "analyst-a", title: "Protocol analysis", success: false, reason: DEMO_FAILURE_REASON },
  { agentId: "analyst-a", title: "DeFi landscape research", success: true, qualityScore: 6.8 },
  { agentId: "analyst-a", title: "L2 comparison research", success: true, qualityScore: 5.9 },
  { agentId: "analyst-a", title: "Stablecoin research", success: true, qualityScore: 6.2 },
  { agentId: "analyst-a", title: "NFT market research", success: false, reason: "missed deadline" },
  { agentId: "analyst-a", title: "Bridge security research", success: true, qualityScore: 6.0 },
  { agentId: "analyst-a", title: "Restaking research", success: true, qualityScore: 6.4 },
  { agentId: "analyst-a", title: "Gas market research", success: true, qualityScore: 6.1 },
  { agentId: "analyst-a", title: "Onchain identity research", success: true, qualityScore: 5.7 },

  // Analyst C: 12 completed, 0 failed.
  { agentId: "analyst-c", title: "Base research", success: true, qualityScore: 9.5 },
  { agentId: "analyst-c", title: "Protocol analysis", success: true, qualityScore: 9.3 },
  { agentId: "analyst-c", title: "DeFi landscape research", success: true, qualityScore: 9.6 },
  { agentId: "analyst-c", title: "L2 comparison research", success: true, qualityScore: 9.2 },
  { agentId: "analyst-c", title: "Stablecoin research", success: true, qualityScore: 9.4 },
  { agentId: "analyst-c", title: "NFT market research", success: true, qualityScore: 9.1 },
  { agentId: "analyst-c", title: "Bridge security research", success: true, qualityScore: 9.5 },
  { agentId: "analyst-c", title: "Restaking research", success: true, qualityScore: 9.6 },
  { agentId: "analyst-c", title: "Gas market research", success: true, qualityScore: 9.3 },
  { agentId: "analyst-c", title: "Onchain identity research", success: true, qualityScore: 9.4 },
  { agentId: "analyst-c", title: "Market research", success: true, qualityScore: 9.5 },
  { agentId: "analyst-c", title: "Governance research", success: true, qualityScore: 9.2 },
];
