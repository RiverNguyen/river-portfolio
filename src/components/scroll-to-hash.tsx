"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { useLenis } from "@/components/lenis-provider"

export function ScrollToHash() {
  const pathname = usePathname()
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis || typeof window === "undefined") return
    const hash = window.location.hash
    if (!hash) return
    if (pathname !== "/") return

    const target = document.querySelector(hash)
    if (!target) return

    lenis.scrollTo(hash, {
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  }, [pathname, lenis])

  return null
}
