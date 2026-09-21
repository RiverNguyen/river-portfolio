"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { routing } from "@/i18n/routing"

import { ChanhDaiMark } from "./chanhdai-mark"

const calcDistance = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  const scrollTop = document.documentElement.scrollTop
  const headerHeight = 56
  return scrollTop + rect.top + rect.height - headerHeight
}

function ChanhDaiMarkMotion() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const coverMark = document.getElementById("js-cover-mark")
    let distance = coverMark ? calcDistance(coverMark) : 160

    const update = () => {
      setVisible(window.scrollY >= distance)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })

    const resizeObserver = coverMark
      ? new ResizeObserver(() => {
          distance = calcDistance(coverMark)
          update()
        })
      : null
    if (coverMark && resizeObserver) resizeObserver.observe(coverMark)

    return () => {
      window.removeEventListener("scroll", update)
      resizeObserver?.disconnect()
    }
  }, [])

  return (
    <ChanhDaiMark
      data-visible={visible}
      className="translate-y-2 opacity-0 transition-[opacity,translate] duration-300 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100"
    />
  )
}

export function SiteHeaderMark() {
  const pathname = usePathname()
  const homePaths = ["/", "/index", ...routing.locales.map((locale) => `/${locale}`)]
  const isHome = homePaths.includes(pathname)

  return isHome ? <ChanhDaiMarkMotion /> : <ChanhDaiMark />
}
