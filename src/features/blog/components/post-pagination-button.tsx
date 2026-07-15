"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Link } from "@/i18n/navigation"

type PostPaginationButtonProps = {
  href: string
  direction: "previous" | "next"
  label: string
}

export function PostPaginationButton({
  href,
  direction,
  label,
}: PostPaginationButtonProps) {
  const Icon = direction === "previous" ? ArrowLeftIcon : ArrowRightIcon

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="secondary" size="icon-sm" asChild>
            <Link href={href}>
              <Icon />
              <span className="sr-only">{label}</span>
            </Link>
          </Button>
        }
      />

      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          {label}
          <Kbd>
            <Icon />
          </Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
