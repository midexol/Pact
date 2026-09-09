/** Inline trend line for a stat card — magnitude over a short recent
 *  sequence. Thin 2px stroke, gradient fill under the line, a rounded
 *  end-dot marking "now" (the mark spec's data-end anchor). */
export function Sparkline({
  values,
  className,
  stroke = "var(--accent)",
  height = 36,
  width = 120,
}: {
  values: number[];
  className?: string;
  stroke?: string;
  height?: number;
  width?: number;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 4;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });

  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lastX, lastY] = points[points.length - 1];
  const fillPath = `${path} L${lastX},${height - pad} L${points[0][0]},${height - pad} Z`;
  const gradId = `spark-fill-${stroke.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={`Trend: ${values.map((v) => v.toFixed(1)).join(", ")}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradId})`} stroke="none" />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="3" fill={stroke} />
    </svg>
  );
}
