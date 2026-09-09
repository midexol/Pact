import { NextResponse } from "next/server";
import { recall } from "@/lib/memory/service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const agentId = url.searchParams.get("agentId") ?? undefined;
  const category = url.searchParams.get("category") ?? undefined;
  const task = url.searchParams.get("task") ?? undefined;
  const events = await recall({ agentId, category, task });
  return NextResponse.json({ events });
}
