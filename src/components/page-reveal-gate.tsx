"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

import { routing } from "@/i18n/routing"

const PageRevealScene = dynamic(() =>
  import("@/components/page-reveal").then((mod) => mod.PageReveal)
)

function isHomePath(pathname: string) {
  if (pathname === "/") return true
  return routing.locales.some((locale) => pathname === `/${locale}`)
}

export function PageRevealGate() {
  const pathname = usePathname()
  if (!isHomePath(pathname)) return null
  return <PageRevealScene />
}
