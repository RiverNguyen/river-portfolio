"use client"

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react"
import { usePathname } from "next/navigation"
import { useEffect, useLayoutEffect, useState } from "react"

import { StarfieldBackground } from "@/components/canvasui/starfield"
import { SlidingNumber } from "@/components/ui/sliding-number"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export const PRELOADER_STORAGE_KEY = "portfolio-preloader-seen"

function isHomePath(pathname: string) {
  if (pathname === "/") return true
  return routing.locales.some((locale) => pathname === `/${locale}`)
}

function clearBootOverlay() {
  document.documentElement.removeAttribute("data-preloader")
}

export function PageReveal() {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const barWidth = useTransform(count, [0, 100], ["0%", "100%"])
  const [display, setDisplay] = useState("0")
  // null = undecided (SSR / first client pass). Boot CSS covers first visits.
  const [phase, setPhase] = useState<"loading" | "reveal" | "done" | null>(null)

  useLayoutEffect(() => {
    if (!isHomePath(pathname)) {
      clearBootOverlay()
      setPhase("done")
      return
    }

    try {
      if (localStorage.getItem(PRELOADER_STORAGE_KEY) === "1") {
        clearBootOverlay()
        setPhase("done")
        return
      }
    } catch {
      // private mode — continue to show once
    }

    if (prefersReducedMotion) {
      try {
        localStorage.setItem(PRELOADER_STORAGE_KEY, "1")
      } catch {
        // ignore
      }
      clearBootOverlay()
      setPhase("done")
      return
    }

    setPhase("loading")
  }, [pathname, prefersReducedMotion])

  // React preloader is on screen — drop the CSS boot cover so reveal shows the real page.
  useLayoutEffect(() => {
    if (phase !== "loading") return

    const frame = requestAnimationFrame(() => {
      clearBootOverlay()
    })
    return () => cancelAnimationFrame(frame)
  }, [phase])

  useEffect(() => {
    if (phase !== "loading" && phase !== "reveal") return

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [phase])

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      setDisplay(String(v))
    })
    return unsubscribe
  }, [rounded])

  useEffect(() => {
    if (phase !== "loading") return

    count.set(0)
    const controls = animate(count, 100, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        try {
          localStorage.setItem(PRELOADER_STORAGE_KEY, "1")
        } catch {
          // ignore write failures
        }
        // Freeze starfield for a beat, then slide — avoids canvas+transform jank.
        setPhase("reveal")
      },
    })
    return controls.stop
  }, [phase, count])

  useEffect(() => {
    if (phase !== "reveal") return
    clearBootOverlay()
  }, [phase])

  if (phase === null || phase === "done") return null

  const revealing = phase === "reveal"

  return (
    <motion.div
      data-page-reveal
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] text-white"
      initial={false}
      animate={revealing ? { y: "-100%" } : { y: 0 }}
      transition={{
        duration: 0.55,
        ease: [0.76, 0, 0.24, 1],
      }}
      style={{ willChange: revealing ? "transform" : "auto" }}
      onAnimationComplete={() => {
        setPhase((current) => (current === "reveal" ? "done" : current))
      }}
    >
      <StarfieldBackground
        className="absolute inset-0 z-0"
        count={140}
        speed={0.85}
        twinkle
        paused={revealing}
      />

      <Corner className="top-5 left-5 z-[2] border-t border-l sm:top-8 sm:left-8" />
      <Corner className="top-5 right-5 z-[2] border-t border-r sm:top-8 sm:right-8" />
      <Corner className="bottom-5 left-5 z-[2] border-b border-l sm:bottom-8 sm:left-8" />
      <Corner className="right-5 bottom-5 z-[2] border-r border-b sm:right-8 sm:bottom-8" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        <motion.p
          className="font-pixel-square text-[11px] tracking-[0.35em] text-zinc-500 uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          Nguyễn Đình Giang
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative flex items-baseline gap-1 font-pixel-square text-white select-none">
            <div className="text-7xl tabular-nums sm:text-8xl">
              <SlidingNumber value={Number(display)} padStart />
            </div>
            <motion.span
              className="text-2xl text-zinc-400 sm:text-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              %
            </motion.span>
          </div>

          <TextShimmerWave
            as="p"
            className="font-pixel-square text-xs tracking-[0.28em] text-zinc-400 uppercase"
            duration={1.15}
          >
            Loading portfolio
          </TextShimmerWave>
        </motion.div>

        <div className="relative mt-2 w-[min(18rem,70vw)]">
          <div className="h-px w-full bg-white/10" />
          <motion.div
            className="absolute top-0 left-0 h-px bg-white"
            style={{ width: barWidth }}
          />
          <motion.div
            className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.45)]"
            style={{ left: barWidth, x: "-50%" }}
          />
          <div className="mt-3 flex justify-between font-mono text-[10px] tracking-wider text-zinc-600 uppercase">
            <span>Init</span>
            <span>Ready</span>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute top-0 left-0 z-10 h-0.5 bg-white"
        style={{ width: barWidth }}
      />
    </motion.div>
  )
}

function Corner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute size-6 border-white/25",
        className
      )}
      aria-hidden
    />
  )
}
