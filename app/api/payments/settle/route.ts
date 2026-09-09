import { NextResponse } from "next/server";
import { getPaymentClient } from "@/lib/base/payments";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await getPaymentClient().settle(body);
  return NextResponse.json({ result });
}
