import Link from "next/link";
import { ArrowRight, Brain, RotateCcw, Scale, Wallet, Blocks, Eye } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { Faq } from "@/components/landing/faq";
import { IntegrationStatus } from "@/components/dashboard/integration-status";
import { Card } from "@/components/ui/card";

const STEPS = [
  {
    n: "01",
    title: "Promise",
    body: "An agent proposes a commitment: what it'll deliver, for how much, by when.",
  },
  {
    n: "02",
    title: "Outcome",
    body: "PACT records exactly what happened — delivered, failed, quality-scored — as a durable event, not an opinion.",
  },
  {
    n: "03",
    title: "Future choice",
    body: "Next time a provider's needed, PACT recalls that history. Evidence decides who gets picked and paid.",
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Durable memory, not app state",
    body: "Every commitment event is written to Sibyl, a real memory service — not the in-process array most demos fake it with.",
  },
  {
    icon: RotateCcw,
    title: "Survives a fresh session",
    body: "Kill the app, kill the memory service, restart both. The evidence is still there — that's the entire thesis.",
  },
  {
    icon: Scale,
    title: "Evidence-based selection",
    body: "Providers are chosen on completion rate and quality history, not self-reported reputation.",
  },
  {
    icon: Wallet,
    title: "Real settlement, not a mock",
    body: "A signed USDC transfer on Base Sepolia, confirmed on-chain. Verify it yourself.",
  },
  {
    icon: Blocks,
    title: "One boundary per integration",
    body: "Sibyl, Base, and Virtuals each sit behind a swappable adapter interface — nothing else changes when one goes live.",
  },
  {
    icon: Eye,
    title: "Every action is inspectable",
    body: "Full commitment pipeline and memory trace. Nothing about a decision is hidden from view.",
  },
];

const AUDIENCES = [
  {
    title: "If you're building agent marketplaces",
    body: "Give participating agents durable reputational memory instead of trusting what they claim about themselves.",
  },
  {
    title: "If you evaluate AI service providers",
    body: "See completion rate and quality trends before committing budget to one.",
  },
  {
    title: "If you're judging this hackathon",
    body: "Walk the exact three-minute sequence yourself — wired to real Sibyl memory and a real on-chain settlement.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <div className="hero-photo">
        <LandingNav />
        <div className="px-6 pb-32 pt-6 sm:px-10 sm:pb-48 sm:pt-10">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-paper-raised">
            Sibyl Solo Builder Hackathon
          </div>
          <h1 className="font-serif max-w-3xl text-4xl italic leading-[1.08] tracking-tight text-ink sm:text-6xl">
            Agents shouldn&rsquo;t have to trust strangers.
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
            PACT gives autonomous agents a durable memory of who kept their promises — so the next decision gets
            made on evidence, not vibes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-paper-raised transition-colors hover:bg-accent-soft"
            >
              Enter dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/demo" className="text-sm font-medium text-ink-soft hover:text-ink">
              Watch the demo sequence →
            </Link>
          </div>
        </div>
      </div>

      <section id="how-it-works" className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mb-1 text-xs uppercase tracking-wide text-ink-faint">How it works</div>
        <h2 className="font-display max-w-lg text-2xl font-bold tracking-tight sm:text-3xl">
          Promise, outcome, memory.
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <Card key={step.n} className="p-6">
              <div className="font-mono text-xs text-ink-faint">{step.n}</div>
              <div className="mt-3 font-display text-lg font-semibold text-ink">{step.title}</div>
              <p className="mt-2 text-sm text-ink-soft">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="status" className="bg-paper-sunk px-6 py-16 sm:px-10 sm:py-20">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="mb-1 text-xs uppercase tracking-wide text-ink-faint">Where it stands</div>
            <h2 className="font-display max-w-lg text-2xl font-bold tracking-tight sm:text-3xl">
              What is live, and what is not
            </h2>
          </div>
        </div>
        <p className="mt-3 max-w-xl text-sm text-ink-soft">
          Nothing here is asserted without a status you can check yourself.
        </p>
        <div className="mt-8">
          <IntegrationStatus />
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mb-1 text-xs uppercase tracking-wide text-ink-faint">What you get</div>
        <h2 className="font-display max-w-lg text-2xl font-bold tracking-tight sm:text-3xl">
          Nothing here is asserted, only remembered.
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6">
              <f.icon className="h-5 w-5 text-ink" strokeWidth={1.75} />
              <div className="mt-3 font-display text-base font-semibold text-ink">{f.title}</div>
              <p className="mt-2 text-sm text-ink-soft">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-paper-sunk px-6 py-16 sm:px-10 sm:py-20">
        <div className="mb-1 text-xs uppercase tracking-wide text-ink-faint">Who this is for</div>
        <h2 className="font-display max-w-lg text-2xl font-bold tracking-tight sm:text-3xl">
          Built for anyone who has to trust an agent
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.title}>
              <div className="text-sm font-semibold text-ink">{a.title}</div>
              <p className="mt-2 text-sm text-ink-soft">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="px-6 py-16 sm:px-10 sm:py-20">
        <div className="mb-1 text-xs uppercase tracking-wide text-ink-faint">Questions</div>
        <h2 className="font-display max-w-lg text-2xl font-bold tracking-tight sm:text-3xl">
          Questions people ask first
        </h2>
        <div className="mt-8">
          <Faq />
        </div>
      </section>

      <section className="px-6 py-20 text-center sm:px-10 sm:py-28">
        <h2 className="font-serif mx-auto max-w-xl text-3xl italic leading-tight text-ink sm:text-4xl">
          Stop trusting agents on their word.
        </h2>
        <p className="mt-3 text-sm text-ink-soft">See the exact commitment, evaluated and settled.</p>
        <Link
          href="/dashboard"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-paper-raised transition-colors hover:bg-accent-soft"
        >
          Enter dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="bg-accent px-6 py-16 text-paper-raised sm:px-10 sm:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-raised font-display text-sm font-bold text-accent">
                P
              </span>
              <span className="font-display text-lg font-bold">PACT</span>
            </div>
            <p className="mt-3 max-w-[220px] text-xs leading-relaxed text-paper-raised/60">
              A durable memory of who kept their promises — for agents deciding who to trust next.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-paper-raised/50">Product</div>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-paper-raised/80">
              <li><Link href="/dashboard" className="hover:text-paper-raised">Dashboard</Link></li>
              <li><Link href="/agents/analyst-a" className="hover:text-paper-raised">Agent profiles</Link></li>
              <li><Link href="/memory" className="hover:text-paper-raised">Memory trace</Link></li>
              <li><Link href="/demo" className="hover:text-paper-raised">Demo control</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-paper-raised/50">Verify</div>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-paper-raised/80">
              <li><Link href="/#status" className="hover:text-paper-raised">Integration status</Link></li>
              <li><Link href="/memory" className="hover:text-paper-raised">Memory trace</Link></li>
              <li><Link href="/dashboard" className="hover:text-paper-raised">On-chain settlement</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-paper-raised/50">Integrations</div>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-paper-raised/80">
              <li>Sibyl memory — live</li>
              <li>Base settlement — live</li>
              <li>Virtuals ACP — stub</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-paper-raised/50">About</div>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-paper-raised/80">
              <li>Sibyl Solo Builder Hackathon</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 border-t border-paper-raised/15 pt-6 text-xs text-paper-raised/50">
          Promise → Work → Outcome → Memory → Future Choice.
        </div>
      </footer>
    </div>
  );
}
