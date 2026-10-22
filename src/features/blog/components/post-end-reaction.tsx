"use client"

import { useEffect, useRef } from "react"

import { reactMascot } from "@/components/mascot"

/** Sentinel at the end of a post: the mascot celebrates once the reader gets here. */
export function PostEndReaction() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      reactMascot("sparkle")
      observer.disconnect()
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} aria-hidden />
}
