import type { InsightsPayload } from "../types"

export function formatInsightsRange(
  range: InsightsPayload["range"],
  locale: string
) {
  const fmt = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
  })

  return `${fmt.format(new Date(`${range.start}T00:00:00Z`))} – ${fmt.format(new Date(`${range.end}T00:00:00Z`))}`
}
