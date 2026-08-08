"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useMemo, useRef, useState } from "react"
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

import type { InsightsPayload } from "../types"

const TRACK_KEY = "rv_visit_tracked"

function formatCount(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(
    value
  )
}

function formatDuration(ms: number, locale: string) {
  if (ms <= 0) return "—"
  const totalSec = Math.round(ms / 1000)
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  if (locale === "vi") {
    if (minutes <= 0) return `${seconds}s`
    return `${minutes}p ${seconds.toString().padStart(2, "0")}s`
  }
  if (minutes <= 0) return `${seconds}s`
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`
}

function formatChange(change: number | null) {
  if (change == null || Number.isNaN(change)) return null
  const abs = Math.abs(change)
  const formatted = abs >= 10 ? abs.toFixed(0) : abs.toFixed(1)
  return `${change >= 0 ? "↑" : "↓"} ${formatted}%`
}

export function VisitorsInsights({
  initialInsights,
}: {
  initialInsights: InsightsPayload
}) {
  const t = useTranslations("Visitors")
  const locale = useLocale()
  const [insights, setInsights] = useState(initialInsights)
  const startedAt = useRef<number>(Date.now())
  const durationSent = useRef(false)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const alreadyTracked = sessionStorage.getItem(TRACK_KEY) === "1"
        const res = await fetch("/api/visitors", {
          method: alreadyTracked ? "GET" : "POST",
        })
        if (!res.ok) return
        if (!alreadyTracked) sessionStorage.setItem(TRACK_KEY, "1")
        const data = (await res.json()) as InsightsPayload
        if (!cancelled) setInsights(data)
      } catch {
        // decorative
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const sendDuration = () => {
      if (durationSent.current) return
      const elapsed = Date.now() - startedAt.current
      if (elapsed < 1500) return
      durationSent.current = true
      const body = JSON.stringify({ durationMs: elapsed })
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/visitors",
          new Blob([body], { type: "application/json" })
        )
      } else {
        void fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        })
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === "hidden") sendDuration()
    }

    window.addEventListener("pagehide", sendDuration)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("pagehide", sendDuration)
      document.removeEventListener("visibilitychange", onVisibility)
      sendDuration()
    }
  }, [])

  const chartConfig = {
    visitors: {
      label: t("uniqueVisitors"),
      color: "var(--foreground)",
    },
    views: {
      label: t("views"),
      color: "var(--muted-foreground)",
    },
  } satisfies ChartConfig

  const metrics = useMemo(
    () => [
      {
        key: "visitors",
        label: t("uniqueVisitors"),
        value: formatCount(insights.metrics.visitors.value, locale),
        change: insights.metrics.visitors.change,
      },
      {
        key: "sessions",
        label: t("sessions"),
        value: formatCount(insights.metrics.sessions.value, locale),
        change: insights.metrics.sessions.change,
      },
      {
        key: "views",
        label: t("views"),
        value: formatCount(insights.metrics.views.value, locale),
        change: insights.metrics.views.change,
      },
      {
        key: "duration",
        label: t("sessionDuration"),
        value: formatDuration(insights.metrics.durationMs.value, locale),
        change: insights.metrics.durationMs.change,
      },
    ],
    [insights, locale, t]
  )

  return (
    <div>
      <div className="grid grid-cols-2 divide-x divide-y divide-edge sm:grid-cols-4 sm:divide-y-0">
        {metrics.map((metric) => {
          const changeLabel = formatChange(metric.change)
          const isUp = (metric.change ?? 0) >= 0

          return (
            <div key={metric.key} className="space-y-3 px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {metric.label}
                </p>
                {changeLabel ? (
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      isUp ? "text-success" : "text-destructive"
                    )}
                  >
                    {changeLabel}
                  </span>
                ) : null}
              </div>
              <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-[1.75rem]">
                {metric.value}
              </p>
            </div>
          )
        })}
      </div>

      <div className="border-t border-edge px-2 pt-2 pb-3 sm:px-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-44 w-full sm:h-52"
          initialDimension={{ width: 640, height: 208 }}
        >
          <ComposedChart
            data={insights.series}
            margin={{ top: 12, right: 8, left: 8, bottom: 4 }}
          >
            <defs>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.16}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-views)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 6"
              className="stroke-edge"
            />
            <XAxis dataKey="date" hide />
            <YAxis hide domain={[0, "auto"]} />
            <ChartTooltip
              cursor={{ stroke: "var(--color-edge)", strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (typeof value !== "string") return value
                    return new Intl.DateTimeFormat(
                      locale === "vi" ? "vi-VN" : "en-US",
                      { month: "short", day: "numeric" }
                    ).format(new Date(`${value}T00:00:00Z`))
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="var(--color-views)"
              strokeWidth={1.5}
              fill="url(#fillViews)"
              fillOpacity={1}
              strokeOpacity={0.55}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3.5 }}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </div>
  )
}
