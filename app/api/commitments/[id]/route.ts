import { NextResponse } from "next/server";
import { getCommitment } from "@/lib/commitments/store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const commitment = getCommitment(id);
  if (!commitment) return NextResponse.json({ error: "Commitment not found" }, { status: 404 });
  return NextResponse.json({ commitment });
}
