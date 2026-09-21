"use client"

import { ArrowUpIcon } from "lucide-react"
import { useMotionValueEvent, useScroll } from "motion/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ScrollToTopProps = React.ComponentProps<"button"> & {
  /** Sit in the chat dock instead of a separate fixed corner. */
  docked?: boolean
}

export function ScrollToTop({
  className,
  docked = false,
  ...props
}: ScrollToTopProps) {
  const { scrollY } = useScroll()

  const [visible, setVisible] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setVisible(latestValue >= 400)

    const prev = scrollY.getPrevious() ?? 0
    const diff = latestValue - prev
    setScrollDirection(diff > 0 ? "down" : "up")
  })

  return (
    <Button
      data-visible={visible}
      data-scroll-direction={scrollDirection}
      className={cn(
        "z-50 transition-[background-color,opacity,width,padding,margin] duration-300",
        "data-[scroll-direction=down]:opacity-30 data-[scroll-direction=up]:opacity-100",
        "data-[scroll-direction=down]:hover:opacity-100",
        "active:scale-100",
        docked
          ? cn(
              "relative shrink-0",
              "data-[visible=false]:pointer-events-none data-[visible=false]:mr-0 data-[visible=false]:w-0 data-[visible=false]:overflow-hidden data-[visible=false]:border-0 data-[visible=false]:p-0 data-[visible=false]:opacity-0"
            )
          : cn(
              "[--bottom:1rem] lg:[--bottom:2rem]",
              "fixed right-4 bottom-[calc(var(--bottom,1rem)+env(safe-area-inset-bottom,0px))] lg:right-8",
              "data-[visible=false]:opacity-0"
            ),
        className
      )}
      variant="secondary"
      size="icon-lg"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      {...props}
    >
      <ArrowUpIcon className="size-5" />
      <span className="sr-only">Scroll to top</span>
    </Button>
  )
}
