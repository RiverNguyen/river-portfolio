"use client"

import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useState } from "react"

import { SlidingNumber } from "@/components/ui/sliding-number"
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"

export function PageReveal() {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const barWidth = useTransform(count, [0, 100], ["0%", "100%"])
  const [display, setDisplay] = useState("")
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading")

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      setDisplay(String(v))
    })
    return unsubscribe
  }, [rounded])

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: 3,
      ease: "linear",
      onComplete: () => {
        setTimeout(() => setPhase("reveal"), 200)
      },
    })
    return controls.stop
  }, [count])

  useEffect(() => {
    if (phase === "reveal") {
      const timer = setTimeout(() => setPhase("done"), 800)
      return () => clearTimeout(timer)
    }
  }, [phase])

  if (phase === "done") return null

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-black text-white"
      animate={
        phase === "reveal"
          ? { y: "-100%" }
          : undefined
      }
      transition={{
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative flex items-baseline gap-1 font-pixel-square text-white select-none">
          <div className="text-7xl tabular-nums sm:text-8xl">
            <SlidingNumber value={Number(display || "0")} padStart />
          </div>
          <motion.span
            className="text-2xl sm:text-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            %
          </motion.span>
        </div>

        <TextShimmerWave
          as="p"
          className="text-sm uppercase tracking-[0.2em] text-zinc-400 mt-4"
          duration={1.2}
        >
          Loading portfolio...
        </TextShimmerWave>
      </div>

      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-white"
        style={{ width: barWidth }}
      />
    </motion.div>
  )
}
