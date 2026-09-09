# PACT — Persistent Agent Commitment Tracking

Built for the Sibyl Solo Builder Hackathon (hack.sibyllanbs.org).

PACT is a commitment-memory layer for autonomous agents. It records what an
agent promised, the conditions of the commitment, what it delivered, how
the result was evaluated, and how the commitment was settled — so that
historical behavior can influence future agent-to-agent decisions.

**Core thesis:** autonomous agents should not have to trust strangers.

## The demo story

1. A Researcher agent needs a Base ecosystem research report.
2. Analyst A accepts the paid commitment and fails it (incomplete sourcing).
3. PACT remembers the failure.
4. The session ends. A fresh session begins.
5. The Researcher asks for a provider again. PACT retrieves both agents'
   comparable history and rejects Analyst A on the evidence.
6. Analyst C is selected, delivers, and is evaluated at 9.4/10.
7. Base settles the USDC payment. PACT remembers the success, updating
   Analyst C's history for next time.

Run it yourself from **Demo control** in the sidebar — each step is a real
call through the commitment engine, the memory service, and the payment
adapter, not a scripted animation.

## Architecture

```
Next.js dashboard  →  PACT Core API (commitment engine, selection, evaluation, settlement)
                              │                              │
                         SIBYL (live)              VIRTUALS (demo stub)
                    (persistent memory)          (agent commerce boundary)
                              │                              │
                              └──────────────┬───────────────┘
                                        BASE (live)
                                    (USDC settlement)
```

PACT owns business logic; Sibyl owns persistent memory; Virtuals handles
the agent-commerce boundary; Base handles onchain settlement. Sibyl and
Base are real, verified integrations — Virtuals still runs on a
deterministic 3-agent roster (see "Wiring in the real integrations" below).

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. `DEMO_MODE=true` (the default, see
`.env.example`) runs the whole flow — memory, provider discovery,
settlement — on deterministic in-memory adapters, so no external
credentials are required to see the full story end to end.

To verify the core thesis without the UI:

```bash
npm run test:memory
```

This remembers a failure, clears live session state, starts a "fresh
session," and confirms the failure is still recallable and still changes
who gets selected next.

## Wiring in the real integrations

Every external dependency sits behind a narrow interface so the rest of
the app never has to change when the live adapter goes in:

| Boundary | Interface | Demo implementation | Live implementation |
|---|---|---|---|
| Memory | `lib/memory/types.ts` (`MemoryStore`) | `lib/memory/index.ts` (in-memory) | `lib/sibyl/client.ts` — **live and verified**. Runs inside the actual app (not just unit-tested standalone) against `sibyl-sidecar/`; memory survives killing and restarting both the Next.js process and the sidecar independently, because it's backed by SQLite on disk, not process state |
| Settlement | `lib/base/client.ts` (`BasePaymentClient`) | `lib/base/payments.ts` (`DemoPaymentClient`) | `lib/base/payments.ts` (`LiveBasePaymentClient`) — **live and verified**. Signs and broadcasts a real ERC-20 USDC transfer on Base Sepolia via `viem`. Proof: [`0xe7b0416afe9dc742d181c8d866df4bfeb67aad41bacbbcbdc2b1332a078aeda3`](https://sepolia.basescan.org/tx/0xe7b0416afe9dc742d181c8d866df4bfeb67aad41bacbbcbdc2b1332a078aeda3) — a real 10 USDC transfer settling Analyst C's payment, confirmed on-chain (`status: success`) |
| Agent discovery | `lib/virtuals/client.ts` (`VirtualsClient`) | `lib/virtuals/jobs.ts` (`DemoVirtualsClient`) | `lib/virtuals/jobs.ts` (`LiveVirtualsClient`) — not yet implemented, needs Virtuals ACP API access. Per the build plan's fallback strategy this is the one boundary that's fine to leave stubbed under time pressure; nothing else in the demo depends on it |

Set the corresponding credentials in `.env.local` and flip `DEMO_MODE=false`
to go live. Sibyl and Base are both verified end to end; Virtuals still
runs on its deterministic 3-agent roster (`data/agents.ts`) regardless of
`DEMO_MODE`, since `LiveVirtualsClient` isn't implemented yet.

### Sibyl: local SDK, not a hosted API

`sibyl-memory-client` (docs.sibyllabs.org) is a local, file-based Python SDK
over SQLite — there's no hosted HTTP endpoint for a TypeScript app to call.
`sibyl-sidecar/` is a small FastAPI wrapper around the real `MemoryClient`
that `lib/sibyl/client.ts` talks to over `localhost`. Every call in it was
checked against the actual `sibyl_memory_client==0.8.0` source, smoke-
tested standalone (`/health`, `/remember`, `/recall`), and then exercised
through the full `/demo` sequence from inside the running app — see
`sibyl-sidecar/README.md` for the run steps and the reasoning behind using
the entities tier (`category=agentId`) instead of the journal.

### Base: a real Sepolia wallet, not a simulated tx hash

`LiveBasePaymentClient` builds an ERC-20 `transfer()` call, signs it with
`BASE_PRIVATE_KEY`, broadcasts it to `BASE_RPC_URL`, and waits for the
receipt before returning — the same interface `DemoPaymentClient` fakes
instantly with a `demo_`-prefixed hash. The USDC contract address
(`0x036CbD53842c5426634e7929541eC2318f3dCF7e` on Base Sepolia) was verified
directly against the chain — calling `symbol()`/`decimals()` over RPC and
confirming `"USDC"` / `6` — rather than trusted from a search result, after
one lookup came back with a truncated address. Analyst C's demo wallet in
`data/agents.ts` is a real generated address, not the placeholder pattern
the other agents still use, so the one live settlement transaction has a
genuine recipient.

Bring up both live dependencies together for a full live run:

```bash
cd sibyl-sidecar && pip install -r requirements.txt && uvicorn main:app --port 8787 &
npm run dev
```

Both `npm run dev` and the sidecar need to be running for `DEMO_MODE=false`
to actually exercise the live adapters — neither survives a terminal/session
restart on its own, so check `curl -sf http://localhost:3000` and
`curl -sf http://127.0.0.1:8787/health` before assuming either is still up.

## Project structure

```
app/
  api/            REST surface (agents, commitments, memory, payments, demo)
  agents/[id]/    Agent profile
  commitments/[id]/  Commitment detail
  memory/         Memory trace
  demo/           Demo control ("Start New Session")
components/       UI (dashboard shell, ui primitives)
data/             Demo agents + the deterministic demo task/seed history
lib/
  agents/         Provider history + evidence-based selection
  base/           USDC settlement adapter
  commitments/    State machine, creation, action handlers, in-process store
  demo/           Orchestrates the 7-step demo (RESET → ... → SETTLE)
  memory/         MemoryStore interface + in-memory impl + service facade
  sibyl/          Sibyl adapter (swap-in for the memory interface)
  virtuals/       Virtuals ACP adapter
types/            Commitment and Agent domain types
scripts/          Standalone fresh-session persistence test
```

## Definition of done

A judge watches a failed commitment become persistent memory, watches a
fresh session retrieve that memory, sees the agent's decision change
because of the evidence, sees a successful agent complete the work, and
verifies a settlement.

**Promise → Work → Outcome → Memory → Future Choice.**
