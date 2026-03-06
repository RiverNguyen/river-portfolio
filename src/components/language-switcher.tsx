"use client"

import { useRouter as useBProgressRouter } from "@bprogress/next"
import { LanguagesIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useMemo } from "react"

import { usePathname, useRouter as useNextIntlRouter } from "@/i18n/navigation"

import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const LOCALES = ["en", "vi"] as const
type Locale = (typeof LOCALES)[number]

export function LanguageSwitcher() {
  const t = useTranslations("Nav")
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const nextIntlRouter = useNextIntlRouter()
  const router = useBProgressRouter({
    customRouter: () => nextIntlRouter,
    i18nPath: true,
  })
  const searchParams = useSearchParams()

  const search = useMemo(() => {
    const qs = searchParams.toString()
    return qs ? `?${qs}` : ""
  }, [searchParams])

  const hash = typeof window !== "undefined" ? window.location.hash : ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("language")}>
          <LanguagesIcon className="size-4" />
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-36">
        {LOCALES.map((target) => (
          <DropdownMenuItem
            key={target}
            onSelect={() => {
              if (target === locale) return
              router.replace(`${pathname}${search}${hash}`, { locale: target })
            }}
          >
            <span className="flex w-full items-center justify-between">
              <span>{target.toUpperCase()}</span>
              {target === locale ? <span aria-hidden="true">✓</span> : null}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

