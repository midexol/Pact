"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DemoStep } from "@/lib/demo/runner";

const STEPS: { step: DemoStep; label: string; blurb: string }[] = [
  { step: "RESET", label: "Reset", blurb: "Clear commitments and reseed baseline history." },
  { step: "CREATE_FAILURE", label: "Analyst A fails", blurb: "Accept the job, fail it, remember why." },
  { step: "FRESH_SESSION", label: "Start new session", blurb: "End the session. Memory carries over." },
  { step: "RECALL", label: "Recall evidence", blurb: "Retrieve both agents' comparable history." },
  { step: "SELECT", label: "Select provider", blurb: "Score the evidence, reject A, pick C." },
  { step: "CREATE_SUCCESS", label: "Analyst C delivers", blurb: "Accept, deliver, evaluate at 9.4/10." },
  { step: "SETTLE", label: "Settle payment", blurb: "Base settles USDC. History updates." },
];

interface DemoResult {
  step: DemoStep;
  message: string;
  sessionId: string;
  selection?: {
    selected: { agentId: string };
    rejected: { agentId: string }[];
  };
}

export function DemoConsole() {
  const [log, setLog] = useState<DemoResult[]>([]);
  const [pending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState<DemoStep | null>(null);
  const router = useRouter();

  const completedSteps = new Set(log.map((l) => l.step));
  const nextStepIndex = STEPS.findIndex((s) => !completedSteps.has(s.step));
  const isSettled = completedSteps.has("SETTLE");

  async function run(step: DemoStep) {
    setActiveStep(step);
    const res = await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step }),
    });
    const { state } = await res.json();
    setLog((prev) => (step === "RESET" ? [state] : [...prev, state]));
    setActiveStep(null);
    startTransition(() => router.refresh());
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr] lg:gap-10">
      <div className="flex flex-col gap-2.5">
        {STEPS.map((s, i) => {
          const done = completedSteps.has(s.step);
          const isNext = i === nextStepIndex;
          const locked = i > nextStepIndex && nextStepIndex !== -1;
          const isActive = activeStep === s.step;
          return (
            <motion.button
              key={s.step}
              disabled={locked || pending || activeStep !== null}
              onClick={() => run(s.step)}
              whileTap={!locked ? { scale: 0.98 } : undefined}
              className={cn(
                "card relative flex items-start gap-3.5 rounded-xl px-4 py-3.5 text-left transition-all disabled:cursor-not-allowed",
                isNext && !isActive && "border-ink/25 shadow-[0_4px_16px_-10px_rgba(28,21,15,0.35)]",
                (done || locked) && "opacity-55"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px]",
                  done ? "bg-settled-bg text-ink-soft" : isNext ? "bg-accent text-paper-raised" : "bg-line-soft text-ink-faint"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : isActive ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="text-sm font-semibold text-ink">{s.label}</div>
                <div className="mt-0.5 text-xs text-ink-faint">{s.blurb}</div>
              </div>
            </motion.button>
          );
        })}
        <AnimatePresence>
          {nextStepIndex === -1 && log.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <Button variant="primary" className="mt-1 w-full" onClick={() => run("RESET")}>
                <RotateCcw className="h-3.5 w-3.5" />
                Replay demo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="card rounded-2xl p-6">
        <h2 className="text-sm font-medium text-ink-soft">Session log</h2>
        {log.length === 0 && <p className="mt-4 text-sm text-ink-faint">Nothing has happened yet — start with Reset.</p>}
        <ol className="mt-4 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {log.map((entry, i) => {
              const settledStep = entry.step === "SETTLE";
              return (
                <motion.li
                  key={`${entry.step}-${i}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "border-b border-line-soft pb-4 last:border-b-0 last:pb-0",
                    settledStep && "rounded-xl border-b-0 bg-settled-bg p-4"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink">{entry.step.replace("_", " ")}</span>
                    <span className="font-mono text-[10px] text-ink-faint">session {entry.sessionId}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-ink-soft">{entry.message}</p>
                  {entry.selection && (
                    <p className="mt-1.5 text-xs text-ink-faint">
                      Rejected: {entry.selection.rejected.map((r) => r.agentId).join(", ")} · Selected:{" "}
                      <span className="font-medium text-ink">{entry.selection.selected.agentId}</span>
                    </p>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
        {isSettled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-5 rounded-xl bg-settled-bg px-4 py-3 text-xs text-ink-soft"
          >
            Full loop closed: promise → work → outcome → memory → future choice.
          </motion.div>
        )}
      </div>
    </div>
  );
}
