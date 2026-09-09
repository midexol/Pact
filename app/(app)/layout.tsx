import type { ReactNode } from "react";
import { SideNav } from "@/components/dashboard/side-nav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-[1680px] flex-col sm:flex-row">
      <SideNav />
      <main className="min-w-0 flex-1 pb-28 sm:border-l sm:border-line sm:pb-0">{children}</main>
    </div>
  );
}
