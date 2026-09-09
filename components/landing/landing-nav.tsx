import Link from "next/link";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#status", label: "Status" },
  { href: "#faq", label: "FAQ" },
  { href: "/docs", label: "Docs" },
];

export function LandingNav() {
  return (
    <header className="px-4 pt-6 sm:px-6 sm:pt-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between rounded-full bg-accent py-2.5 pl-4 pr-2.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] sm:pl-5 sm:pr-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper-raised font-display text-xs font-bold text-accent">
            P
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-paper-raised">PACT</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-paper-raised/70 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-paper-raised">
              {link.label}
            </a>
          ))}
        </nav>
        <Link
          href="/dashboard"
          className="rounded-full bg-paper-raised px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-paper"
        >
          Enter dashboard
        </Link>
      </div>
    </header>
  );
}
