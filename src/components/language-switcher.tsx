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

const LOCALES = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "vi", label: "VI", flag: "🇻🇳" },
] as const

type Locale = (typeof LOCALES)[number]["code"]

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("language")}>
          <LanguagesIcon className="size-4" />
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-36">
        {LOCALES.map(({ code, label, flag }) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => {
              if (code === locale) return
              const hash = window.location.hash
              router.replace(`${pathname}${search}${hash}`, { locale: code })
            }}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="text-base leading-none" aria-hidden>
                  {flag}
                </span>
                <span>{label}</span>
              </span>
              {code === locale ? <span aria-hidden="true">✓</span> : null}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

