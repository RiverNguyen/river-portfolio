"use client"

import { TZDate } from "@date-fns/tz"
import { format } from "date-fns"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type LiveNowStripProps = {
  timeZone: string
  buildingTitle?: string
  className?: string
}

export function LiveNowStrip({
  timeZone,
  className,
}: LiveNowStripProps) {
  const t = useTranslations("NowStrip")
  const [time, setTime] = useState("")

  useEffect(() => {
    const tick = () => {
      setTime(format(TZDate.tz(timeZone), "HH:mm"))
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [timeZone])

  return (
    <Link
      href="/hire"
      aria-label={t("hireCta")}
      className={cn(
        "hidden shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[10px] tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground md:inline-flex",
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500/90" />
        {t("open")}
      </span>
      <span className="hidden h-3 w-px shrink-0 bg-edge xl:block" aria-hidden />
      <span className="hidden tabular-nums xl:inline">
        {t("hanoi")} {time || "—:—"}
      </span>
    </Link>
  )
}
