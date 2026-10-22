"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const VIEWED_KEY_PREFIX = "rv_post_viewed:"

export function PostViews({ slug }: { slug: string }) {
  const t = useTranslations("Blog")
  const [views, setViews] = useState<number | null>(null)

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

  if (views == null) return null

  return (
    <>
      {" · "}
      {t("views", { count: views })}
    </>
  )
}
