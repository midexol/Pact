import { NextResponse } from "next/server";
import { demoAgents } from "@/data/agents";

export async function GET() {
  return NextResponse.json({ agents: demoAgents });
}
