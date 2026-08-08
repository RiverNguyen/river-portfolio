"use client"

import { ArrowRightIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { Panel } from "./panel"

export function ContactCta() {
  const t = useTranslations("Portfolio")
  const reduceMotion = useReducedMotion()

  return (
    <Panel id="contact-cta" className="overflow-hidden">
      <Link
        href="/contact"
        className={cn(
          "group relative isolate block outline-none",
          "transition-[background-color] duration-300 ease-out",
          "hover:bg-accent-muted focus-visible:bg-accent-muted",
          "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset"
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-1",
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
            "bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/45"
          )}
        />

        <div className="relative z-10 flex flex-col gap-7 px-4 py-8 sm:px-6 sm:py-10">
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
            <span className="size-1.5 rounded-[1px] bg-foreground/70" />
            {t("contactCtaStatus")}
          </p>

          <div className="max-w-lg space-y-3">
            <motion.h2
              className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.45,
                delay: 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {t("contactCtaTitle")}
            </motion.h2>
            <p className="max-w-md font-mono text-sm leading-relaxed text-balance text-muted-foreground">
              {t("contactCtaDescription")}
            </p>
          </div>

          <Button
            className="pointer-events-none w-fit px-3"
            variant="default"
            tabIndex={-1}
            asChild
          >
            <span>
              {t("contactCtaAction")}
              <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Button>
        </div>
      </Link>
    </Panel>
  )
}
