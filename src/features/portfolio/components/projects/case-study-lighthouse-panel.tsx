import type { CaseStudyMetric } from "@/features/portfolio/data/case-studies"
import { cn } from "@/lib/utils"

function findMetric(metrics: CaseStudyMetric[], pattern: RegExp) {
  return metrics.find((metric) => pattern.test(metric.label))
}

function parsePerformanceScore(value: string) {
  const numeric = Number.parseInt(value, 10)
  if (Number.isNaN(numeric)) return null
  return Math.min(100, Math.max(0, numeric))
}

function scoreStyle(score: number) {
  const hue = score >= 90 ? 142 : score >= 50 ? 45 : 0
  return {
    background: `conic-gradient(hsl(${hue} 70% 45%) ${score * 3.6}deg, color-mix(in oklab, var(--color-edge) 70%, transparent) 0deg)`,
  }
}

export function CaseStudyLighthousePanel({
  metrics,
  title,
  labNote,
  className,
}: {
  metrics: CaseStudyMetric[]
  title: string
  labNote: string
  className?: string
}) {
  const performance = findMetric(metrics, /performance/i)
  const lcp = findMetric(metrics, /^lcp$/i)
  const performanceScore = performance
    ? parsePerformanceScore(performance.value)
    : null

  if (!performance && !lcp) return null

  return (
    <div
      className={cn(
        "grid gap-4 rounded-xl border border-edge bg-muted/20 p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:p-5",
        className
      )}
    >
      {performanceScore !== null && performance ? (
        <div className="flex items-center gap-4">
          <div
            className="relative grid size-24 shrink-0 place-items-center rounded-full p-1"
            style={scoreStyle(performanceScore)}
            role="img"
            aria-label={`${performance.label} ${performanceScore}`}
          >
            <div className="grid size-full place-items-center rounded-full bg-background">
              <span className="text-3xl font-semibold tabular-nums tracking-tight">
                {performanceScore}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              {title}
            </p>
            <p className="text-sm font-medium">{performance.label}</p>
            {performance.note ? (
              <p className="font-mono text-[11px] text-muted-foreground">
                {performance.note}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {lcp ? (
        <div className="space-y-1 border-t border-edge pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {lcp.label}
          </p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
            {lcp.value}
          </p>
          {lcp.note ? (
            <p className="font-mono text-[11px] text-muted-foreground">
              {lcp.note}
            </p>
          ) : null}
        </div>
      ) : null}

      <p className="font-mono text-[10px] leading-relaxed text-muted-foreground sm:col-span-2">
        {labNote}
      </p>
    </div>
  )
}
