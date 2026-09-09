import { NextResponse } from "next/server";
import { applyAction, CommitmentNotFoundError, InvalidTransitionError } from "@/lib/commitments/actions";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  try {
    const commitment = await applyAction(id, "settle", body);
    return NextResponse.json({ commitment });
  } catch (err) {
    if (err instanceof CommitmentNotFoundError) {
      return NextResponse.json({ error: "Commitment not found" }, { status: 404 });
    }
    if (err instanceof InvalidTransitionError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
