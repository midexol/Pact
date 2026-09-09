"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Brain, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agents/analyst-a", label: "Agent profiles", icon: Users, match: "/agents" },
  { href: "/memory", label: "Memory trace", icon: Brain },
  { href: "/demo", label: "Demo control", icon: PlayCircle },
];

function isActive(pathname: string, link: (typeof LINKS)[number]) {
  const match = link.match ?? link.href;
  return pathname.startsWith(match);
}

export function SideNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside className="hidden w-[240px] shrink-0 flex-col justify-between border-r border-line bg-paper-sunk/60 py-8 pl-6 pr-4 sm:flex">
        <div>
          <Link href="/" className="block">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-paper-raised">
                P
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-ink">PACT</span>
            </div>
            <div className="mt-2 text-[11px] leading-snug text-ink-faint">
              Persistent Agent
              <br />
              Commitment Tracking
            </div>
          </Link>

          <nav className="mt-10 flex flex-col gap-1">
            {LINKS.map((link) => {
              const active = isActive(pathname, link);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-full px-3.5 py-2 text-sm transition-colors",
                    active ? "bg-accent text-paper-raised" : "text-ink-soft hover:bg-line-soft hover:text-ink"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="text-[11px] leading-relaxed text-ink-faint">
          <span className="text-ink-soft">Sibyl</span> · Virtuals · <span className="text-ink-soft">Base</span>
          <br />
          Sibyl Solo Builder Hackathon
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-line bg-paper-raised px-2 py-2 sm:hidden">
        {LINKS.map((link) => {
          const active = isActive(pathname, link);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px]",
                active ? "text-ink" : "text-ink-faint"
              )}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              {link.label.split(" ")[0]}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
