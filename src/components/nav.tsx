"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

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
  const pathname = usePathname()
  const lenis = useLenis()

  return (
    <nav
      data-active-id={activeId}
      className={cn("flex items-center gap-4", className)}
    >
      {items.map(({ title, href }) => {
        const active =
          activeId === href ||
          (href === "/"
            ? ["/", "/index"].includes(activeId || "")
            : activeId?.startsWith(href))

        const hasHash = href.includes("#")
        const [path, hash] = hasHash ? href.split("#") : [href, ""]
        const pathNorm = path || "/"
        const isSamePageHash = hasHash && pathname === pathNorm

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
