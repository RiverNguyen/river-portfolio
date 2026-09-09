"use client"

import { ArrowUpRightIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

export function PrivateProjectNotice({
  title,
  description,
  cta,
  className,
  compact = false,
  onNavigate,
}: {
  title: string
  description: string
  cta: string
  className?: string
  compact?: boolean
  onNavigate?: () => void
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-edge bg-muted/40",
        compact ? "space-y-2 p-3" : "space-y-3 p-4 sm:p-5",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <LockIcon
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <p className="font-medium">{title}</p>
      </div>

      <p className="text-sm text-pretty text-muted-foreground">{description}</p>

      <Button
        variant={compact ? "outline" : "default"}
        size="sm"
        className="mt-1"
        asChild
      >
        <Link href="/contact" onClick={onNavigate}>
          {cta}
          <ArrowUpRightIcon />
        </Link>
      </Button>
    </div>
  )
}
