"use client"

import { usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import React from "react"

import { Link } from "@/i18n/navigation"
import { useLenis } from "@/components/lenis-provider"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/types/nav"

export function Nav({
  items,
  activeId,
  className,
}: {
  items: NavItem[]
  activeId?: string
  className?: string
}) {
  const locale = useLocale()
  const pathname = usePathname()
  const lenis = useLenis()

  const pathnameNorm = normalizePathname(pathname, locale)

  return (
    <nav
      data-active-id={activeId}
      className={cn("flex items-center gap-4", className)}
    >
      {items.map(({ title, href }) => {
        const hasHash = href.includes("#")
        const [path, hash] = hasHash ? href.split("#") : [href, ""]
        const pathNorm = path || "/"
        const isSamePageHash = hasHash && pathnameNorm === pathNorm

        const active =
          hasHash && hash
            ? activeId === href || activeId === `#${hash}`
            : activeId === href ||
              (href === "/"
                ? ["/", "/index"].includes(activeId || "")
                : activeId?.startsWith(href))

        if (isSamePageHash && hash) {
          const target = `#${hash}`
          return (
            <a
              key={href}
              href={target}
              className={cn(
                "font-mono text-sm font-medium text-muted-foreground transition-[color] duration-300",
                active && "text-foreground"
              )}
              onClick={(e) => {
                e.preventDefault()
                lenis?.scrollTo(target, { duration: 1.2 })
              }}
            >
              {title}
            </a>
          )
        }

        return (
          <NavItem key={href} href={href} active={active}>
            {title}
          </NavItem>
        )
      })}
    </nav>
  )
}

export function NavItem({
  active,
  ...props
}: React.ComponentProps<typeof Link> & {
  active?: boolean
}) {
  return (
    <Link
      className={cn(
        "font-mono text-sm font-medium text-muted-foreground transition-[color] duration-300",
        active && "text-foreground"
      )}
      {...props}
    />
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
