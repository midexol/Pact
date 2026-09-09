export type AgentStatus = "ONLINE" | "BUSY" | "OFFLINE";

export interface AgentStats {
  commitments: number;
  completed: number;
  failed: number;
  onTimeRate: number;
  averageQuality: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  skills: string[];
  walletAddress?: string;
  status: AgentStatus;
  stats: AgentStats;
}

export interface AgentRole {
  /** "requester" asks for work, "provider" performs work. Demo agents can be either. */
  role: "requester" | "provider";
}
