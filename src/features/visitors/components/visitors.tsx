import { getLocale, getTranslations } from "next-intl/server"

import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"

import { getInsights } from "../lib/store"
import { formatInsightsRange } from "../lib/format"
import { VisitorsInsights } from "./visitors-insights"

export async function Visitors() {
  const t = await getTranslations("Visitors")
  const locale = await getLocale()
  const insights = await getInsights(30)

  return (
    <Panel id="visitors">
      <PanelHeader className="flex items-end justify-between gap-4">
        <PanelTitle className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span>{t("title")}</span>
          <span className="font-mono text-sm font-medium text-muted-foreground">
            ({formatInsightsRange(insights.range, locale)})
          </span>
        </PanelTitle>
        <p className="pb-0.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase max-sm:hidden">
          {t("subtitle")}
        </p>
      </PanelHeader>

      <VisitorsInsights initialInsights={insights} />
    </Panel>
  )
}
