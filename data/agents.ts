import type { Agent } from "@/types/agent";

export const demoAgents: Agent[] = [
  {
    id: "researcher",
    name: "Researcher",
    description: "Requests paid research jobs and picks a provider from historical evidence.",
    skills: ["requesting", "research"],
    status: "ONLINE",
    stats: { commitments: 0, completed: 0, failed: 0, onTimeRate: 0, averageQuality: 0 },
  },
  {
    id: "analyst-a",
    name: "Analyst A",
    description: "Research provider. Prone to incomplete sourcing under deadline pressure.",
    skills: ["research", "market research", "protocol analysis"],
    walletAddress: "0xA1a1000000000000000000000000000000A1a1",
    status: "ONLINE",
    stats: { commitments: 11, completed: 8, failed: 3, onTimeRate: 0.72, averageQuality: 6.1 },
  },
  {
    id: "analyst-c",
    name: "Analyst C",
    description: "Research provider with a clean completion record on comparable work.",
    skills: ["research", "base ecosystem research", "protocol analysis"],
    walletAddress: "0x2D955eF520476313083f5b41F6e7369b297Cc678",
    status: "ONLINE",
    stats: { commitments: 12, completed: 12, failed: 0, onTimeRate: 1, averageQuality: 9.4 },
  },
];

export function getAgent(id: string): Agent | undefined {
  return demoAgents.find((a) => a.id === id);
}
