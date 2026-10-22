"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

// One request shared by every item in the list.
let allViews: Promise<Record<string, number> | null> | null = null

function loadAllViews() {
  allViews ??= fetch("/api/views")
    .then(async (res) =>
      res.ok
        ? ((await res.json()) as { views: Record<string, number> | null }).views
        : null
    )
    .catch(() => null)
  return allViews
}

export function PostViewCount({ slug }: { slug: string }) {
  const t = useTranslations("Blog")
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    void loadAllViews().then((all) => {
      if (!cancelled) setViews(all?.[slug] ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (!views) return null

  return (
    <>
      {" · "}
      {t("views", { count: views })}
    </>
  )
}
