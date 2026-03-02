"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { Nav } from "@/components/nav"
import type { NavItem } from "@/types/nav"

export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  const [activeHash, setActiveHash] = useState<string | null>(null)

  useEffect(() => {
    // Only enable scrollspy on the main portfolio page
    if (pathname !== "/") {
      return
    }

    const hashIds = items
      .map((link) => {
        const [, hash] = link.href.split("#")
        return hash
      })
      .filter((id): id is string => Boolean(id))

    if (!hashIds.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstVisible = entries.find((entry) => entry.isIntersecting)

        if (firstVisible) {
          setActiveHash(`#${firstVisible.target.id}`)
          return
        }

        // If none of the observed sections are visible in this batch,
        // clear the active hash so the page-level item becomes active again.
        if (entries.every((entry) => !entry.isIntersecting)) {
          setActiveHash(null)
        }
      },
      { rootMargin: "0% 0% -80% 0%" }
    )

    hashIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
      }
    })

    return () => {
      hashIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) {
          observer.unobserve(el)
        }
      })
    }
  }, [items, pathname])

  const activeId =
    pathname === "/" && activeHash ? activeHash : pathname

  return <Nav className="max-sm:hidden" items={items} activeId={activeId} />
}
