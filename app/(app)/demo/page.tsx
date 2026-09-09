import { DemoConsole } from "@/components/dashboard/demo-console";

export default function DemoPage() {
  return (
    <div className="px-6 py-8 sm:px-10 sm:py-10">
      <header>
        <div className="mb-1 text-xs uppercase tracking-wide text-ink-faint">Live sequence</div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Demo control</h1>
        <p className="mt-2 max-w-lg text-sm text-ink-soft">
          Walk the exact three-minute story: a failure gets remembered, the session ends, a fresh session starts, and
          the evidence changes who gets picked next.
        </p>
      </header>
      <DemoConsole />
    </div>
  );
}
