"use client"

import { useTranslations } from "next-intl"
import { Mascot } from "page-mascot"
import { useCallback, useRef } from "react"
import { toast } from "sonner"

import { useSoundLazy } from "@/hooks/use-sound"
import { cn } from "@/lib/utils"

type ProfileMascotProps = {
  className?: string
  directions?: string
  label?: string
  reactions?: string
  size?: number
  wrapperClassName?: string
}

export function ProfileMascot({
  className,
  directions = "/mascots/river-directions.webp",
  label = "River mascot",
  reactions = "/mascots/river-reactions.webp",
  size,
  wrapperClassName,
}: ProfileMascotProps) {
  const { play: playClick } = useSoundLazy("/audio/ui-sounds/click.wav")
  const t = useTranslations("EasterEggs")
  const clicksRef = useRef(0)

  const onMascotClick = useCallback(() => {
    playClick(0.42)
    clicksRef.current += 1
    const count = clicksRef.current
    if (count === 3) {
      toast(t("mascotStage1"))
    } else if (count === 6) {
      toast(t("mascotStage2"))
    } else if (count >= 9) {
      clicksRef.current = 0
      toast(t("mascotStage3"))
    }
  }, [playClick, t])

  return (
    <div
      className={cn(
        "group/avatar relative flex size-full items-center justify-center overflow-hidden rounded-full",
        "bg-[radial-gradient(circle_at_50%_42%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_42%),linear-gradient(180deg,color-mix(in_oklab,var(--muted)_78%,transparent),transparent)]",
        "shadow-[inset_0_1px_0_color-mix(in_oklab,var(--foreground)_12%,transparent),inset_0_-18px_32px_color-mix(in_oklab,var(--foreground)_4%,transparent)]",
        "before:pointer-events-none before:absolute before:inset-2 before:rounded-full before:border before:border-foreground/8",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_18%,white_0,transparent_18%)] after:opacity-8",
        wrapperClassName
      )}
      onClickCapture={onMascotClick}
    >
      <div className="pointer-events-none absolute inset-x-5 bottom-5 h-4 rounded-full bg-foreground/12 blur-md transition-opacity group-hover/avatar:opacity-80" />
      <Mascot
        className={cn(
          "relative z-1 -translate-y-0.5 drop-shadow-[0_10px_18px_color-mix(in_oklab,var(--foreground)_22%,transparent)] transition-transform duration-300 ease-out group-hover/avatar:-translate-y-1 group-hover/avatar:scale-[1.02]",
          className
        )}
        directions={directions}
        reactions={reactions}
        label={label}
        size={size}
      />
    </div>
  )
}
