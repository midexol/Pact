import { NextResponse } from "next/server";
import {
  runReset,
  runCreateFailure,
  runFreshSession,
  runRecall,
  runSelect,
  runCreateSuccess,
  runSettle,
  type DemoStep,
} from "@/lib/demo/runner";

const RUNNERS: Record<DemoStep, () => Promise<unknown>> = {
  RESET: runReset,
  CREATE_FAILURE: runCreateFailure,
  FRESH_SESSION: runFreshSession,
  RECALL: runRecall,
  SELECT: runSelect,
  CREATE_SUCCESS: runCreateSuccess,
  SETTLE: runSettle,
};

export async function POST(req: Request) {
  const { step } = (await req.json()) as { step: DemoStep };
  const runner = RUNNERS[step];
  if (!runner) return NextResponse.json({ error: `Unknown demo step: ${step}` }, { status: 400 });
  const state = await runner();
  return NextResponse.json({ state });
}
