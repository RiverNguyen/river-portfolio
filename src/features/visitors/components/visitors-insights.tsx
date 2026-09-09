"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useMemo, useRef, useState } from "react"

import Grid from "@/components/charts/grid"
import LineChart, { Line } from "@/components/charts/line-chart"
import { ChartTooltip } from "@/components/charts/tooltip"
import {
  Metric,
  MetricChange,
  MetricLabel,
  MetricValue,
} from "@/components/metric"

import type { InsightsPayload } from "../types"

const TRACK_KEY = "rv_visit_tracked"

function formatCount(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(value)
}

function formatDuration(ms: number, locale: string) {
  if (ms <= 0) return "—"
  const totalSec = Math.round(ms / 1000)
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  if (minutes <= 0) return `${seconds}s`
  if (locale === "vi") {
    return `${minutes}p ${seconds.toString().padStart(2, "0")}s`
  }
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`
}

export function VisitorsInsights({
  initialInsights,
}: {
  initialInsights: InsightsPayload
}) {
  const t = useTranslations("Visitors")
  const locale = useLocale()
  const [insights, setInsights] = useState(initialInsights)
  const startedAt = useRef<number>(0)
  const durationSent = useRef(false)

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

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

  const numberFmt = useMemo(
    () => new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US"),
    [locale]
  )

  return (
    <div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 md:grid-cols-4">
          <div className="border-r border-edge" />
          <div className="border-r border-edge max-md:hidden" />
          <div className="border-r border-edge max-md:hidden" />
        </div>

        <dl className="grid grid-cols-2 md:grid-cols-4">
          {metrics.map((metric) => (
            <Metric key={metric.key}>
              <MetricLabel>
                {metric.label}
                <MetricChange value={metric.change} />
              </MetricLabel>
              <MetricValue>{metric.value}</MetricValue>
            </Metric>
          ))}
        </dl>
      </div>

      <div className="border-t border-edge px-2 pt-3 pb-2 sm:px-3">
        {insights.series.length > 0 ? (
          <LineChart
            className="md:aspect-3/1!"
            data={insights.series}
            margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
          >
            <Grid horizontal />
            <Line
              dataKey="views"
              stroke="var(--chart-line-secondary)"
              strokeWidth={2}
            />
            <Line
              dataKey="visitors"
              stroke="var(--chart-line-primary)"
              strokeWidth={2}
            />
            <ChartTooltip
              rows={(point) => [
                {
                  color: "var(--chart-line-primary)",
                  label: t("uniqueVisitors"),
                  value: numberFmt.format(Number(point.visitors ?? 0)),
                },
                {
                  color: "var(--chart-line-secondary)",
                  label: t("views"),
                  value: numberFmt.format(Number(point.views ?? 0)),
                },
              ]}
            />
          </LineChart>
        ) : (
          <div className="grid aspect-2/1 w-full place-content-center md:aspect-3/1">
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
