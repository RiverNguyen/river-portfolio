import { ArrowRightIcon, FileQuestionIcon } from "lucide-react"
import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export async function NotFound({ className }: { className?: string }) {
  const t = await getTranslations("Common")
  const locale = await getLocale()
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`

  const homeHref = prefix || "/"

  const links = [
    { href: homeHref, label: t("links.home") },
    { href: `${prefix}/projects`, label: t("links.projects") },
    { href: `${prefix}/blog`, label: t("links.blog") },
    { href: `${prefix}/contact`, label: t("links.contact") },
  ]

  return (
    <div
      className={cn(
        "relative isolate flex min-h-[calc(100svh-5.5rem)] flex-col items-center justify-center px-4 py-16",
        className
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-1 opacity-70",
          "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
          "bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/50"
        )}
      />

      <div className="w-full max-w-md border border-edge bg-background/90 shadow-[0_0_0_1px_var(--color-edge)] backdrop-blur-sm">
        <div className="screen-line-after flex items-center justify-between gap-3 px-4 py-2.5">
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
            <span className="size-1.5 rounded-[1px] bg-foreground/70" />
            {t("notFoundStatus")}
          </p>
          <FileQuestionIcon className="size-3.5 text-muted-foreground" />
        </div>

        <div className="space-y-4 px-4 py-8 text-center sm:px-6">
          <p
            className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase"
            aria-hidden
          >
            ERR_PAGE_NOT_FOUND
          </p>

          <h1 className="text-[5.5rem] leading-none font-semibold tracking-tighter tabular-nums sm:text-8xl">
            404
          </h1>

          <div className="mx-auto max-w-sm space-y-2">
            <h2 className="text-lg font-semibold tracking-tight text-balance">
              {t("notFoundTitle")}
            </h2>
            <p className="font-mono text-sm leading-relaxed text-balance text-muted-foreground">
              {t("notFoundDescription")}
            </p>
          </div>

          <Button variant="default" className="mt-2" asChild>
            <Link href={homeHref}>
              {t("goHome")}
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>

        <div className="screen-line-before grid grid-cols-2 divide-x divide-y divide-edge sm:grid-cols-4 sm:divide-y-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-3 text-center font-mono text-xs text-muted-foreground transition-colors hover:bg-accent-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
