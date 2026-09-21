"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"

const TOURS = [
  {
    id: "1",
    destination: "north",
    title: "Highland loop",
    days: 3,
    price: 420,
  },
  {
    id: "2",
    destination: "central",
    title: "Coastal escape",
    days: 5,
    price: 680,
  },
  {
    id: "3",
    destination: "south",
    title: "Delta discovery",
    days: 2,
    price: 310,
  },
  {
    id: "4",
    destination: "north",
    title: "Mountain trek",
    days: 4,
    price: 540,
  },
] as const

type Destination = (typeof TOURS)[number]["destination"] | "all"

export function TourFilterDemo() {
  const t = useTranslations("CaseStudyDemo")
  const [destination, setDestination] = useState<Destination>("all")
  const [maxPrice, setMaxPrice] = useState(700)

  const filtered = useMemo(() => {
    return TOURS.filter((tour) => {
      if (destination !== "all" && tour.destination !== destination) return false
      if (tour.price > maxPrice) return false
      return true
    })
  }, [destination, maxPrice])

  return (
    <div className="space-y-4 rounded-xl border border-edge bg-muted/15 p-4">
      <p className="font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
        {t("filterLabel")}
      </p>

      <div className="flex flex-wrap gap-2">
        {(["all", "north", "central", "south"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setDestination(value)}
            className={cn(
              "rounded-md border px-2 py-1 font-mono text-[11px] uppercase transition-colors",
              destination === value
                ? "border-foreground bg-foreground text-background"
                : "border-edge text-muted-foreground hover:border-foreground/30"
            )}
          >
            {t(`destination.${value}`)}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-2 font-mono text-xs text-muted-foreground">
        <span className="tracking-wider uppercase">{t("maxPrice")}</span>
        <input
          type="range"
          min={250}
          max={800}
          step={10}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="w-full accent-foreground"
        />
        <span className="tabular-nums text-foreground">${maxPrice}</span>
      </label>

      <ul className="divide-y divide-edge border border-edge">
        {filtered.map((tour) => (
          <li
            key={tour.id}
            className="flex items-center justify-between gap-3 px-3 py-2 font-mono text-sm"
          >
            <span>{tour.title}</span>
            <span className="text-muted-foreground tabular-nums">
              {tour.days}d · ${tour.price}
            </span>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="px-3 py-4 text-center font-mono text-xs text-muted-foreground">
            {t("noResults")}
          </li>
        ) : null}
      </ul>
      <p className="font-mono text-[11px] text-muted-foreground">{t("demoNote")}</p>
    </div>
  )
}
