import { NextResponse } from "next/server";
import { z } from "zod";
import { createCommitment } from "@/lib/commitments/create";
import { saveCommitment, listCommitments } from "@/lib/commitments/store";
import { remember } from "@/lib/memory/service";

export async function GET() {
  return NextResponse.json({ commitments: listCommitments() });
}

const CreateSchema = z.object({
  requesterId: z.string(),
  providerId: z.string(),
  task: z.object({
    title: z.string(),
    description: z.string(),
    requirements: z.array(z.string()),
    category: z.string(),
  }),
  terms: z.object({
    amount: z.string(),
    currency: z.literal("USDC"),
    deadline: z.string(),
  }),
});

export async function POST(req: Request) {
  const body = CreateSchema.parse(await req.json());
  const { commitment, event } = createCommitment(body);
  saveCommitment(commitment);
  await remember(event);
  return NextResponse.json({ commitment }, { status: 201 });
}
