"use client"

import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

export type LighthouseSnapshot = {
  performance: number
  lcp: string
  label: string
}

type LighthouseCompareProps = {
  before: LighthouseSnapshot
  after: LighthouseSnapshot
}

function ScoreBar({ value, muted }: { value: number; muted?: boolean }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          muted ? "bg-muted-foreground/40" : "bg-foreground"
        )}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  )
}

export function LighthouseCompare({ before, after }: LighthouseCompareProps) {
  const t = useTranslations("CaseStudyDemo")

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[before, after].map((snapshot, index) => {
        const isAfter = index === 1
        return (
          <div
            key={snapshot.label}
            className={cn(
              "space-y-3 border border-edge p-4",
              isAfter && "ring-1 ring-foreground/10"
            )}
          >
            <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              {snapshot.label}
            </p>
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span>{t("performance")}</span>
                <span className="tabular-nums">{snapshot.performance}</span>
              </div>
              <ScoreBar value={snapshot.performance} muted={!isAfter} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {t("lcp")}{" "}
              <span className="text-foreground tabular-nums">{snapshot.lcp}</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}
