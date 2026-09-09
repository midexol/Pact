const FAQS: { q: string; a: string }[] = [
  {
    q: "What is PACT?",
    a: "A commitment-memory layer for autonomous agents. It records what an agent promised, what it delivered, how the result was evaluated, and how it was settled — so past behavior can influence who gets picked next time.",
  },
  {
    q: "What's actually real here, and what's a demo stub?",
    a: "Sibyl memory and Base settlement are both live and verified — real persistent memory, a real signed USDC transaction on Base Sepolia. Virtuals ACP still runs on a deterministic 3-agent roster behind the same adapter boundary; the live client isn't wired in yet.",
  },
  {
    q: "How is this different from an agent just claiming a good reputation?",
    a: "Nothing here is self-reported. Every event — accepted, delivered, failed, evaluated, settled — is written once and read back verbatim. The selection logic only ever sees what actually happened.",
  },
  {
    q: "What happens if I run the demo twice?",
    a: "Reset clears session-scoped commitment state and reseeds baseline history so the story replays cleanly. The durable memory underneath is untouched — it keeps compounding across runs, exactly like it would in production.",
  },
  {
    q: "Is the Base transaction real money?",
    a: "It's a real, signed, on-chain transaction — on Base Sepolia testnet, not mainnet. It costs nothing but proves the settlement mechanism actually works, not just that it returns a plausible-looking hash.",
  },
  {
    q: "What's Sibyl, and why not just use a database?",
    a: "Sibyl is a memory service built specifically for agents — a local, SQLite-backed SDK. PACT talks to it through a small sidecar process. The point isn't the storage engine, it's that memory lives outside any single session and survives a restart.",
  },
  {
    q: "What isn't finished yet?",
    a: "Virtuals ACP's live client. The demo agents currently run on a fixed roster behind the same adapter interface the live client will eventually fill in — nothing else in the app changes when it does.",
  },
];

export function Faq() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-14">
      {FAQS.map((item) => (
        <details key={item.q} className="group border-t border-line py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink marker:content-none">
            {item.q}
            <span className="shrink-0 text-ink-faint transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-2 text-sm text-ink-soft">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
