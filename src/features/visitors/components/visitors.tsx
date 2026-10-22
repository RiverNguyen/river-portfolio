import { getTranslations } from "next-intl/server"

import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"

import type { InsightsPayload } from "../types"
import { VisitorsInsights } from "./visitors-insights"

/** Empty shell so the homepage stays static; the client fills this via /api/visitors. */
const EMPTY_INSIGHTS: InsightsPayload = {
  range: { start: "", end: "" },
  metrics: {
    visitors: { value: 0, change: null },
    sessions: { value: 0, change: null },
    views: { value: 0, change: null },
    durationMs: { value: 0, change: null },
  },
  series: [],
}

export async function Visitors() {
  const t = await getTranslations("Visitors")

  return (
    <Panel id="visitors">
      <PanelHeader className="flex items-end justify-between gap-4">
        <PanelTitle className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span>{t("title")}</span>
        </PanelTitle>
        <p className="pb-0.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase max-sm:hidden">
          {t("subtitle")}
        </p>
      </PanelHeader>

      <VisitorsInsights initialInsights={EMPTY_INSIGHTS} />
    </Panel>
  )
}
