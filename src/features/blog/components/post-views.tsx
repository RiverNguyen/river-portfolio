"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const VIEWED_KEY_PREFIX = "rv_post_viewed:"

export function PostViews({ slug }: { slug: string }) {
  const t = useTranslations("Blog")
  const [views, setViews] = useState<number | null>(null)
  const [readers, setReaders] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const key = VIEWED_KEY_PREFIX + slug
        // Count each post once per browser session.
        const alreadyViewed = sessionStorage.getItem(key) === "1"
        const res = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`, {
          method: alreadyViewed ? "GET" : "POST",
        })
        if (!res.ok) return
        if (!alreadyViewed) sessionStorage.setItem(key, "1")
        const data = (await res.json()) as { views: number | null }
        if (!cancelled) setViews(data.views)
      } catch {
        // decorative
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    const id = crypto.randomUUID()
    let cancelled = false

    const beat = async () => {
      if (document.visibilityState !== "visible") return
      try {
        const res = await fetch(
          `/api/views/live?slug=${encodeURIComponent(slug)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        )
        if (!res.ok) return
        const data = (await res.json()) as { readers: number | null }
        if (!cancelled) setReaders(data.readers)
      } catch {
        // decorative
      }
    }

    void beat()
    const interval = setInterval(beat, 30_000)
    document.addEventListener("visibilitychange", beat)
    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener("visibilitychange", beat)
    }
  }, [slug])

  return (
    <>
      {views != null && (
        <>
          {" · "}
          {t("views", { count: views })}
        </>
      )}
      {readers != null && readers > 1 && (
        <>
          {" · "}
          <span className="text-emerald-600 dark:text-emerald-400">
            {t("readingNow", { count: readers })}
          </span>
        </>
      )}
    </>
  )
}
