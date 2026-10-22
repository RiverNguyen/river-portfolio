"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const AiChat = dynamic(
  () =>
    import("@/features/chatbot/components/ai-chat").then((mod) => mod.AiChat),
  { ssr: false }
)

/** Mounts the chat launcher after idle so it does not compete with first paint. */
export function DeferredAiChat() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const enable = () => {
      if (!cancelled) setReady(true)
    }

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 3000 })
      return () => {
        cancelled = true
        window.cancelIdleCallback(id)
      }
    }

    const timer = window.setTimeout(enable, 2000)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  if (!ready) return null
  return <AiChat />
}
