"use client"

import { Mascot } from "page-mascot"

import { cn } from "@/lib/utils"

type ChatMascotAvatarProps = {
  className?: string
  size?: number
  /** Disable pointer tracking when the bubble is just a static mark. */
  staticPose?: boolean
}

export function ChatMascotAvatar({
  className,
  size = 32,
}: ChatMascotAvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden",
        className
      )}
    >
      <Mascot
        directions="/mascots/river-directions.webp"
        reactions="/mascots/river-reactions.webp"
        label="River Bot"
        size={size}
        className="relative z-1 drop-shadow-[0_6px_12px_color-mix(in_oklab,var(--foreground)_18%,transparent)]"
      />
    </div>
  )
}
