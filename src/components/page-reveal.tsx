"use client"

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react"
import { useEffect, useState } from "react"

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
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground"
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
      <div className="relative flex items-baseline gap-1 font-pixel-square text-background select-none">
        <motion.span
          className="text-7xl tabular-nums sm:text-8xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {display}
        </motion.span>
        <motion.span
          className="text-2xl sm:text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          %
        </motion.span>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-background"
        style={{ width: barWidth }}
      />
    </motion.div>
  )
}
