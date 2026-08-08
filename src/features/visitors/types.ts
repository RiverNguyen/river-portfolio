export type DayStat = {
  /** YYYY-MM-DD (UTC) */
  date: string
  visitors: number
  sessions: number
  views: number
}

export type VisitorsStore = {
  visitors: number
  sessions: number
  views: number
  durationTotalMs: number
  durationCount: number
  updatedAt: string
  daily: DayStat[]
}

export type MetricValue = {
  value: number
  /** Percent change vs previous window. Null when previous is empty. */
  change: number | null
}

export type InsightsPayload = {
  range: {
    start: string
    end: string
  }
  metrics: {
    visitors: MetricValue
    sessions: MetricValue
    views: MetricValue
    durationMs: MetricValue
  }
  series: Array<{
    date: string
    visitors: number
    views: number
  }>
}
