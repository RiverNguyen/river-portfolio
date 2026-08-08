"use client"

import { useRef } from "react"
import { toast } from "sonner"

import { SpotlightLogo } from "@/components/spotlight-logo"

export function CoverEasterEgg({
  lines,
}: {
  lines: [string, string, string]
}) {
  const clicksRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (
    <div
      id="js-cover-mark"
      className="w-full max-w-sm px-6 sm:max-w-md"
      onClick={() => {
        clicksRef.current += 1
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          clicksRef.current = 0
        }, 700)

        if (clicksRef.current < 3) return
        clicksRef.current = 0
        toast.message(lines[0], {
          description: `${lines[1]}\n${lines[2]}`,
          duration: 3200,
          classNames: {
            toast: "font-mono",
            title: "font-mono text-xs tracking-wide",
            description: "font-mono text-xs whitespace-pre-line text-muted-foreground",
          },
        })
      }}
    >
      <SpotlightLogo />
    </div>
  )
}
