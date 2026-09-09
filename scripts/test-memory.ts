/**
 * Fresh-session persistence test.
 *
 * Proves the core thesis directly against the library code, no server
 * required: remember a failure, wipe live session state, start a fresh
 * session, and confirm the failure is still recallable and still changes
 * provider selection.
 *
 * Run with: npx tsx scripts/test-memory.ts
 */
import { remember, recall, resetMemory } from "../lib/memory/service";
import { selectProvider } from "../lib/agents/selector";
import { resetCommitments } from "../lib/commitments/store";
import { nanoid } from "nanoid";

async function main() {
  await resetMemory();
  resetCommitments();

  await remember({
    id: `evt_${nanoid(8)}`,
    type: "commitment.failed",
    commitmentId: `cmt_${nanoid(8)}`,
    agentId: "analyst-a",
    category: "base ecosystem research",
    createdAt: new Date().toISOString(),
    payload: { title: "Base ecosystem research", reason: "incomplete sourcing" },
  });
  await remember({
    id: `evt_${nanoid(8)}`,
    type: "commitment.settled",
    commitmentId: `cmt_${nanoid(8)}`,
    agentId: "analyst-c",
    category: "base ecosystem research",
    createdAt: new Date().toISOString(),
    payload: { title: "Base ecosystem research", qualityScore: 9.4 },
  });

  // Simulate ending the session — only live commitment state clears.
  resetCommitments();

  // Fresh session: query memory as if this were a brand new process turn.
  const events = await recall({ category: "base ecosystem research" });
  assert(events.length === 2, `expected 2 remembered events, got ${events.length}`);

  const result = await selectProvider(["analyst-a", "analyst-c"], "base ecosystem research");
  assert(result.selected.agentId === "analyst-c", `expected analyst-c to be selected, got ${result.selected.agentId}`);

  console.log("PASS: memory survives a fresh session and changes selection.");
  console.log(result.reasoning);
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
