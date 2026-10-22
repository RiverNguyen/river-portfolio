"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const SmoothFollower = dynamic(
  () =>
    import("@/components/smooth-follower").then((mod) => mod.SmoothFollower),
  { ssr: false }
)

const DuckFollower = dynamic(
  () => import("@/components/duck-follower").then((mod) => mod.DuckFollower),
  { ssr: false }
)

/** Loads non-critical chrome after the browser is idle so LCP/TBT stay free. */
export function DeferredChrome() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const enable = () => {
      if (!cancelled) setReady(true)
    }

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 2500 })
      return () => {
        cancelled = true
        window.cancelIdleCallback(id)
      }
    }

    const timer = window.setTimeout(enable, 1500)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  if (!ready) return null

  return (
    <>
      <SmoothFollower />
      <DuckFollower />
    </>
  )
}
