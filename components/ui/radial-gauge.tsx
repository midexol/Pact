/** Ring gauge for a single 0-1 magnitude (completion rate, avg quality/10).
 *  Track is a hairline circle; the value arc is a thin rounded stroke,
 *  colored by the same tone system as StatusStamp. */
export function RadialGauge({
  value,
  size = 88,
  strokeWidth = 6,
  tone = "accent",
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: "accent" | "settled" | "failed" | "pending";
  label: string;
  sublabel?: string;
}) {
  const clamped = Math.max(0, Math.min(1, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  const colorVar = { accent: "var(--accent)", settled: "var(--settled)", failed: "var(--failed)", pending: "var(--pending)" }[tone];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorVar}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-mono text-lg font-semibold text-ink">{label}</span>
        {sublabel && <span className="text-[9px] uppercase tracking-wide text-ink-faint">{sublabel}</span>}
      </div>
    </div>
  );
}
