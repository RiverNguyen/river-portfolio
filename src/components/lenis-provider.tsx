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

/** Soft ease for programmatic scrollTo only — not used for wheel smoothing. */
const scrollToEasing = (t: number) =>
  Math.min(1, 1.001 - Math.pow(2, -10 * t))

function createLenis(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return new Lenis({
      autoRaf: true,
      smoothWheel: false,
      lerp: 1,
    })
  }

  // lerp-based wheel scroll feels tighter than duration-based smoothing.
  // Lower lerp = heavier glide; ~0.085–0.1 is usually the sweet spot.
  return new Lenis({
    autoRaf: true,
    smoothWheel: true,
    lerp: 0.09,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    syncTouch: false,
  })
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let instance = createLenis(motionQuery.matches)

    document.documentElement.classList.add("lenis", "lenis-smooth")
    queueMicrotask(() => setLenis(instance))

    const onMotionPreferenceChange = () => {
      instance.destroy()
      instance = createLenis(motionQuery.matches)
      setLenis(instance)
    }

    motionQuery.addEventListener("change", onMotionPreferenceChange)

    return () => {
      motionQuery.removeEventListener("change", onMotionPreferenceChange)
      instance.destroy()
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

export function useScrollTo(): (
  target: string | HTMLElement,
  opts?: { offset?: number }
) => void {
  const lenis = useLenis()
  return useCallback(
    (target: string | HTMLElement, opts?: { offset?: number }) => {
      if (!lenis) return
      lenis.scrollTo(target, {
        offset: opts?.offset ?? 0,
        duration: 1,
        easing: scrollToEasing,
      })
    },
    [lenis]
  )
}
