import { ArrowUpRightIcon } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { getNowByLocale } from "../data/now"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export async function Now() {
  const locale = await getLocale()
  const t = await getTranslations("Portfolio")
  const now = getNowByLocale(locale === "vi" ? "vi" : "en")

  const updated = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(now.updatedAt))

  return (
    <Panel id="now">
      <PanelHeader className="flex items-end justify-between gap-4">
        <PanelTitle>{t("now")}</PanelTitle>
        <p className="pb-0.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          {t("nowUpdated", { date: updated })}
        </p>
      </PanelHeader>

      <PanelContent className="space-y-0 p-0">
        {now.items.map((item, index) => {
          const content = (
            <>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                  {item.label}
                </span>
                {item.href ? (
                  <ArrowUpRightIcon className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                ) : null}
              </div>
              <p className="mt-1.5 text-sm font-medium text-balance sm:text-[15px]">
                {item.title}
              </p>
              {item.note ? (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {item.note}
                </p>
              ) : null}
            </>
          )

          return (
            <div
              key={`${item.label}-${item.title}`}
              className={cn(
                "group px-4 py-3.5 transition-[background-color] ease-out",
                index < now.items.length - 1 && "border-b border-edge",
                item.href && "hover:bg-accent-muted"
              )}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="block outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          )
        })}
      </PanelContent>
    </Panel>
  )
}
