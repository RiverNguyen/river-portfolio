"use client"

import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"

import { useLenis } from "@/components/lenis-provider"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { NavItem } from "@/types/nav"

export function MobileNav({ items }: { items: NavItem[] }) {
  const t = useTranslations("Nav")
  const locale = useLocale()
  const pathname = usePathname()
  const pathnameNorm = normalizePathname(pathname, locale)
  const lenis = useLenis()
  const isDesktop = useMediaQuery("(min-width: 40rem)") // sm breakpoint

  const toggleMenuButton = (
    <Button
      className="group flex flex-col gap-1 data-[state=open]:bg-accent sm:hidden"
      variant="ghost"
      size="icon"
    >
      <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]:translate-y-0.75 group-data-[state=open]:rotate-45" />
      <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]:-translate-y-0.75 group-data-[state=open]:-rotate-45" />
      <span className="sr-only">{t("toggleMenu")}</span>
    </Button>
  )

  if (isDesktop) {
    return toggleMenuButton
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{toggleMenuButton}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="end" sideOffset={8}>
        {items.map((link) => {
          const hasHash = link.href.includes("#")
          const [path, hash] = hasHash ? link.href.split("#") : [link.href, ""]
          const pathNorm = path || "/"
          const isSamePageHash = hasHash && pathnameNorm === pathNorm && hash

          if (isSamePageHash) {
            const target = `#${hash}`
            return (
              <DropdownMenuItem
                key={link.href}
                onSelect={(e) => {
                  e.preventDefault()
                  lenis?.scrollTo(target, { duration: 1.2 })
                }}
              >
                {link.title}
              </DropdownMenuItem>
            )
          }

          return (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href}>{link.title}</Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function normalizePathname(pathname: string, locale: string) {
  if (pathname === `/${locale}`) {
    return "/"
  }

  const prefix = `/${locale}/`
  if (pathname.startsWith(prefix)) {
    return `/${pathname.slice(prefix.length)}`
  }

  return pathname
}
