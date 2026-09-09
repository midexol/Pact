import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Status = "LIVE" | "NEEDS ACCESS" | "STUB";

const STATUS_STYLE: Record<Status, string> = {
  LIVE: "bg-settled-bg text-ink-soft",
  "NEEDS ACCESS": "bg-pending-bg text-ink-soft",
  STUB: "bg-line-soft text-ink-faint",
};

const STATUS_DOT: Record<Status, string> = {
  LIVE: "bg-settled",
  "NEEDS ACCESS": "bg-pending",
  STUB: "bg-ink-faint",
};

const ROWS: { capability: string; status: Status; detail: string }[] = [
  {
    capability: "Sibyl memory",
    status: "LIVE",
    detail: "SQLite-backed sidecar. Verified surviving independent restarts of the app and the sidecar.",
  },
  {
    capability: "Base settlement",
    status: "LIVE",
    detail: "Real signed USDC transfer on Base Sepolia — confirmed on-chain, not simulated.",
  },
  {
    capability: "Virtuals ACP",
    status: "STUB",
    detail: "Deterministic 3-agent roster behind the same adapter boundary. Needs ACP API access.",
  },
];

/** "What's live, and what's not" — nothing here is asserted without a
 *  status a reader can check, same discipline PACT applies to agents. */
export function IntegrationStatus() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-faint">
              <th className="px-5 py-3 font-medium">Capability</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Detail</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.capability} className={cn(i < ROWS.length - 1 && "border-b border-line-soft")}>
                <td className="px-5 py-3.5 font-medium text-ink">{row.capability}</td>
                <td className="px-5 py-3.5">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide", STATUS_STYLE[row.status])}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[row.status])} />
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-ink-soft">{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
