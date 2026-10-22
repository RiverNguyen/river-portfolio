"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

type Track = { title: string; artist: string; url: string; image?: string }

export function NowPlaying() {
  const t = useTranslations("Portfolio")
  const [track, setTrack] = useState<Track | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch("/api/now-playing")
        if (!res.ok) return
        const data = (await res.json()) as Track | null
        if (!cancelled) setTrack(data)
      } catch {
        // decorative
      }
    }
    void load()
    const interval = setInterval(load, 60_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  if (!track) return null

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 border-t border-edge px-4 py-3.5 transition-[background-color] ease-out hover:bg-accent-muted"
    >
      {track.image && (
        <img
          src={track.image}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-md border border-edge"
        />
      )}
      <div className="min-w-0">
        <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          {t("nowListening")}
        </span>
        <p className="mt-1 truncate text-sm font-medium">
          {track.title}
          <span className="font-normal text-muted-foreground">
            {" "}
            — {track.artist}
          </span>
        </p>
      </div>
    </a>
  )
}
