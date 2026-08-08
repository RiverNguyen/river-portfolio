import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import type {
  DayStat,
  InsightsPayload,
  MetricValue,
  VisitorsStore,
} from "../types"

const DAYS = 30
const MAX_DAILY = 400

const DEFAULT_STORE: VisitorsStore = {
  visitors: 0,
  sessions: 0,
  views: 0,
  durationTotalMs: 0,
  durationCount: 0,
  updatedAt: new Date(0).toISOString(),
  daily: [],
}

function getDataPath() {
  return (
    process.env.VISITORS_DATA_PATH ??
    path.join(process.cwd(), "data", "visitors.json")
  )
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function addDays(dateKey: string, delta: number) {
  const date = new Date(`${dateKey}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

async function ensureDataFile() {
  const filePath = getDataPath()
  await mkdir(path.dirname(filePath), { recursive: true })

  try {
    await readFile(filePath, "utf8")
  } catch {
    await writeFile(
      filePath,
      `${JSON.stringify({ ...DEFAULT_STORE, updatedAt: new Date().toISOString() }, null, 2)}\n`,
      "utf8"
    )
  }

  return filePath
}

function normalizeStore(raw: unknown): VisitorsStore {
  if (typeof raw !== "object" || raw === null) {
    return { ...DEFAULT_STORE, updatedAt: new Date().toISOString() }
  }

  const data = raw as Partial<VisitorsStore> & {
    // legacy shape
    views?: number
    visitors?: number
  }

  const visitors = typeof data.visitors === "number" ? data.visitors : 0
  const views = typeof data.views === "number" ? data.views : visitors
  const sessions =
    typeof data.sessions === "number" ? data.sessions : views

  const daily = Array.isArray(data.daily)
    ? data.daily.filter(
        (day): day is DayStat =>
          typeof day === "object" &&
          day !== null &&
          typeof day.date === "string" &&
          typeof day.visitors === "number" &&
          typeof day.sessions === "number" &&
          typeof day.views === "number"
      )
    : []

  // Migrate legacy totals into today if daily is empty
  if (daily.length === 0 && (visitors > 0 || views > 0 || sessions > 0)) {
    daily.push({
      date: todayKey(),
      visitors,
      sessions,
      views,
    })
  }

  return {
    visitors,
    sessions,
    views,
    durationTotalMs:
      typeof data.durationTotalMs === "number" ? data.durationTotalMs : 0,
    durationCount:
      typeof data.durationCount === "number" ? data.durationCount : 0,
    updatedAt:
      typeof data.updatedAt === "string"
        ? data.updatedAt
        : new Date().toISOString(),
    daily,
  }
}

export async function readVisitorsStore(): Promise<VisitorsStore> {
  try {
    const filePath = await ensureDataFile()
    const raw = await readFile(filePath, "utf8")
    return normalizeStore(JSON.parse(raw) as unknown)
  } catch (error) {
    console.error("[Visitors] Failed to read store:", error)
    return { ...DEFAULT_STORE, updatedAt: new Date().toISOString() }
  }
}

async function writeVisitorsStore(store: VisitorsStore) {
  const filePath = await ensureDataFile()
  await writeFile(filePath, `${JSON.stringify(store, null, 2)}\n`, "utf8")
}

function bumpDay(
  daily: DayStat[],
  date: string,
  patch: Partial<Omit<DayStat, "date">>
) {
  const index = daily.findIndex((day) => day.date === date)
  if (index === -1) {
    daily.unshift({
      date,
      visitors: patch.visitors ?? 0,
      sessions: patch.sessions ?? 0,
      views: patch.views ?? 0,
    })
  } else {
    const current = daily[index]
    daily[index] = {
      ...current,
      visitors: current.visitors + (patch.visitors ?? 0),
      sessions: current.sessions + (patch.sessions ?? 0),
      views: current.views + (patch.views ?? 0),
    }
  }

  daily.sort((a, b) => (a.date < b.date ? 1 : -1))
  return daily.slice(0, MAX_DAILY)
}

export async function recordVisit(options: {
  isNewVisitor: boolean
  isNewSession: boolean
}): Promise<VisitorsStore> {
  const current = await readVisitorsStore()
  const date = todayKey()

  const next: VisitorsStore = {
    ...current,
    visitors: current.visitors + (options.isNewVisitor ? 1 : 0),
    sessions: current.sessions + (options.isNewSession ? 1 : 0),
    views: current.views + 1,
    updatedAt: new Date().toISOString(),
    daily: bumpDay([...current.daily], date, {
      visitors: options.isNewVisitor ? 1 : 0,
      sessions: options.isNewSession ? 1 : 0,
      views: 1,
    }),
  }

  await writeVisitorsStore(next)
  return next
}

export async function recordSessionDuration(
  durationMs: number
): Promise<VisitorsStore> {
  const safe = Math.min(Math.max(Math.round(durationMs), 1_000), 60 * 60 * 1000)
  const current = await readVisitorsStore()
  const next: VisitorsStore = {
    ...current,
    durationTotalMs: current.durationTotalMs + safe,
    durationCount: current.durationCount + 1,
    updatedAt: new Date().toISOString(),
  }
  await writeVisitorsStore(next)
  return next
}

function sumRange(daily: DayStat[], start: string, end: string) {
  return daily.reduce(
    (acc, day) => {
      if (day.date < start || day.date > end) return acc
      acc.visitors += day.visitors
      acc.sessions += day.sessions
      acc.views += day.views
      return acc
    },
    { visitors: 0, sessions: 0, views: 0 }
  )
}

function metric(current: number, previous: number): MetricValue {
  if (previous <= 0) {
    return { value: current, change: current > 0 ? 100 : null }
  }
  return {
    value: current,
    change: ((current - previous) / previous) * 100,
  }
}

function buildSeries(daily: DayStat[], end: string, days: number) {
  const byDate = new Map(daily.map((day) => [day.date, day]))
  const series: InsightsPayload["series"] = []

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = addDays(end, -i)
    const bucket = byDate.get(date)
    series.push({
      date,
      visitors: bucket?.visitors ?? 0,
      views: bucket?.views ?? 0,
    })
  }

  return series
}

export async function getInsights(days = DAYS): Promise<InsightsPayload> {
  const store = await readVisitorsStore()
  const end = todayKey()
  const start = addDays(end, -(days - 1))
  const prevEnd = addDays(start, -1)
  const prevStart = addDays(prevEnd, -(days - 1))

  const current = sumRange(store.daily, start, end)
  const previous = sumRange(store.daily, prevStart, prevEnd)

  // Prefer window totals; fall back to lifetime if window empty (fresh migrate)
  const visitorsValue =
    current.visitors > 0 || previous.visitors > 0
      ? current.visitors
      : store.visitors
  const sessionsValue =
    current.sessions > 0 || previous.sessions > 0
      ? current.sessions
      : store.sessions
  const viewsValue =
    current.views > 0 || previous.views > 0 ? current.views : store.views

  const avgDuration =
    store.durationCount > 0
      ? store.durationTotalMs / store.durationCount
      : 0

  return {
    range: { start, end },
    metrics: {
      visitors: metric(visitorsValue, previous.visitors),
      sessions: metric(sessionsValue, previous.sessions),
      views: metric(viewsValue, previous.views),
      durationMs: {
        value: Math.round(avgDuration),
        change: null,
      },
    },
    series: buildSeries(store.daily, end, days),
  }
}

/** @deprecated use getInsights / readVisitorsStore */
export async function readVisitorsStats() {
  const store = await readVisitorsStore()
  return {
    views: store.views,
    visitors: store.visitors,
    updatedAt: store.updatedAt,
  }
}
