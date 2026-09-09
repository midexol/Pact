import { NextResponse } from "next/server";
import { getProviderHistory } from "@/lib/agents/history";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const category = url.searchParams.get("category") ?? undefined;
  const history = await getProviderHistory(id, category);
  return NextResponse.json({ history });
}
