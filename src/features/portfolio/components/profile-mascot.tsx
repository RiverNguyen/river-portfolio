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
        // Soft stage: mid-tone wash + top light so dark hair / white shirt separate
        "bg-[radial-gradient(ellipse_at_50%_28%,color-mix(in_oklab,var(--muted)_55%,var(--foreground)_12%)_0%,transparent_58%),linear-gradient(180deg,color-mix(in_oklab,var(--muted)_88%,transparent),color-mix(in_oklab,var(--background)_82%,var(--muted)_18%))]",
        "shadow-[inset_0_1px_0_color-mix(in_oklab,var(--foreground)_14%,transparent),inset_0_-28px_40px_color-mix(in_oklab,var(--foreground)_5%,transparent)]",
        "transition-[filter] duration-300 ease-out hover:brightness-[1.05]",
        wrapperClassName
      )}
      onClickCapture={onMascotClick}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[16%] bottom-[12%] h-6 rounded-full bg-foreground/14 blur-xl"
      />
      <Mascot
        className={cn(
          "relative z-1 -translate-y-0.5 drop-shadow-[0_6px_14px_color-mix(in_oklab,var(--foreground)_24%,transparent)] transition-transform duration-300 ease-out group-hover/avatar:-translate-y-1 group-hover/avatar:scale-[1.03]",
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
