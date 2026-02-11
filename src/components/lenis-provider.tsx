"use client"

import Lenis from "lenis"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

const LenisContext = createContext<Lenis | null>(null)

function getLenisOptions() {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  return {
    duration: prefersReducedMotion ? 0 : 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
    smoothWheel: !prefersReducedMotion,
    syncTouch: false,
  }
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const options = getLenisOptions()
    const lenisInstance = new Lenis(options)

    document.documentElement.classList.add("lenis", "lenis-smooth")

    function raf(time: number) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    queueMicrotask(() => setLenis(lenisInstance))

    return () => {
      lenisInstance.destroy()
      document.documentElement.classList.remove("lenis", "lenis-smooth")
      setLenis(null)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  )
}

export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

export function useScrollTo(): (target: string | HTMLElement, opts?: { offset?: number }) => void {
  const lenis = useLenis()
  return useCallback(
    (target: string | HTMLElement, opts?: { offset?: number }) => {
      if (!lenis) return
      lenis.scrollTo(target, {
        offset: opts?.offset ?? 0,
        duration: 1.2,
      })
    },
    [lenis]
  )
}
