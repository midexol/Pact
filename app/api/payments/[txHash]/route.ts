import { NextResponse } from "next/server";
import { getPaymentClient } from "@/lib/base/payments";

export async function GET(_req: Request, { params }: { params: Promise<{ txHash: string }> }) {
  const { txHash } = await params;
  const result = await getPaymentClient().getTransaction(txHash);
  return NextResponse.json({ result });
}
