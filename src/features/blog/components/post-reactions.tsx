"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { reactMascot } from "@/components/mascot"
import { cn } from "@/lib/utils"

const REACTIONS = [
  { type: "like", emoji: "👍" },
  { type: "fire", emoji: "🔥" },
  { type: "idea", emoji: "💡" },
] as const

type Counts = Record<(typeof REACTIONS)[number]["type"], number>

const STORAGE_KEY = "rv_post_reactions"

function readMine(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<
      string,
      string[]
    >
  } catch {
    return {}
  }
}

export function PostReactions({ slug }: { slug: string }) {
  const t = useTranslations("Blog")
  const [counts, setCounts] = useState<Counts | null>(null)
  const [mine, setMine] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    fetch(`/api/reactions?slug=${encodeURIComponent(slug)}`)
      .then(async (res) =>
        res.ok ? ((await res.json()) as { counts: Counts | null }) : null
      )
      .then((data) => {
        if (cancelled || !data) return
        setMine(readMine()[slug] ?? [])
        setCounts(data.counts)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [slug])

  // Hidden until the API confirms storage is configured.
  if (!counts) return null

  const react = async (type: keyof Counts) => {
    if (mine.includes(type)) return
    reactMascot(type === "fire" ? "delighted" : "heart")
    const next = [...mine, type]
    setMine(next)
    setCounts({ ...counts, [type]: counts[type] + 1 })
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...readMine(), [slug]: next })
      )
    } catch {
      // private mode
    }
    try {
      const res = await fetch(
        `/api/reactions?slug=${encodeURIComponent(slug)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        }
      )
      const data = (await res.json()) as { counts: Counts | null }
      if (data.counts) setCounts(data.counts)
    } catch {
      // keep optimistic count
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-6">
      <p className="mr-1 font-mono text-sm text-muted-foreground">
        {t("reactPrompt")}
      </p>
      {REACTIONS.map(({ type, emoji }) => {
        const active = mine.includes(type)
        return (
          <button
            key={type}
            type="button"
            onClick={() => react(type)}
            aria-pressed={active}
            aria-label={t(`reaction.${type}`)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-edge px-3 py-1 text-sm transition-[background-color,scale] ease-out active:scale-95",
              active ? "bg-accent" : "hover:bg-accent-muted"
            )}
          >
            <span aria-hidden>{emoji}</span>
            <span className="font-mono text-xs tabular-nums">
              {counts[type]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
