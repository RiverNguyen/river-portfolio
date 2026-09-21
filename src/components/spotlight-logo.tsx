"use client"

import { motion } from "motion/react"

import { useSound } from "@/hooks/soundcn/use-sound"
import { metalClickSound } from "@/lib/metal-click"

/** Theme-adapted mountain illustration used as the cover mark. */
export function SpotlightLogo() {
  const [play] = useSound(metalClickSound)

  return (
    <motion.img
      src="/mountain.svg"
      alt=""
      width={1244}
      height={430}
      draggable={false}
      aria-hidden
      className="h-auto w-full max-w-2xl origin-center touch-manipulation opacity-25 select-none dark:opacity-35 dark:invert"
      whileTap={{ y: 6, scale: 0.99 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      onTap={() => play()}
    />
  )
}
