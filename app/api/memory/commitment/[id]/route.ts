import { NextResponse } from "next/server";
import { recall } from "@/lib/memory/service";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const events = await recall({});
  return NextResponse.json({ events: events.filter((e) => e.commitmentId === id) });
}
