"use client"

import { useEffect, useMemo, useRef } from "react"

import { useIsClient } from "@/hooks/use-is-client"

const INTERACTIVE_SELECTOR =
  "a, button, img, input, textarea, select, [role='button'], [data-cursor-hover]"

const DOT_SMOOTHNESS = 0.2
const BORDER_DOT_SMOOTHNESS = 0.1

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor
}

export function SmoothFollower() {
  const isClient = useIsClient()
  const dotRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)

  const shouldReduceMotion = useMemo(() => {
    if (!isClient) return true
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [isClient])

  const isTouch = useMemo(() => {
    if (!isClient) return true
    return isTouchDevice()
  }, [isClient])

  const shouldRender = isClient && !shouldReduceMotion && !isTouch

  useEffect(() => {
    if (!shouldRender) return

    const mousePosition = { x: -100, y: -100 }
    const dotPosition = { x: -100, y: -100 }
    const borderPosition = { x: -100, y: -100 }

    let animationId = 0
    let isHovering = false

    const setHovering = (next: boolean) => {
      if (isHovering === next) return
      isHovering = next
      const border = borderRef.current
      if (!border) return
      border.style.width = next ? "44px" : "28px"
      border.style.height = next ? "44px" : "28px"
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX
      mousePosition.y = e.clientY
    }

    const handlePointerOver = (e: Event) => {
      const target = e.target
      if (!(target instanceof Element)) return
      if (target.closest(INTERACTIVE_SELECTOR)) setHovering(true)
    }

    const handlePointerOut = (e: Event) => {
      const target = e.target
      if (!(target instanceof Element)) return
      if (!target.closest(INTERACTIVE_SELECTOR)) return

      const related = (e as MouseEvent).relatedTarget
      if (related instanceof Element && related.closest(INTERACTIVE_SELECTOR)) {
        return
      }
      setHovering(false)
    }

    const animate = () => {
      dotPosition.x = lerp(dotPosition.x, mousePosition.x, DOT_SMOOTHNESS)
      dotPosition.y = lerp(dotPosition.y, mousePosition.y, DOT_SMOOTHNESS)
      borderPosition.x = lerp(
        borderPosition.x,
        mousePosition.x,
        BORDER_DOT_SMOOTHNESS
      )
      borderPosition.y = lerp(
        borderPosition.y,
        mousePosition.y,
        BORDER_DOT_SMOOTHNESS
      )

      const dot = dotRef.current
      const border = borderRef.current
      if (dot) {
        dot.style.left = `${dotPosition.x}px`
        dot.style.top = `${dotPosition.y}px`
      }
      if (border) {
        border.style.left = `${borderPosition.x}px`
        border.style.top = `${borderPosition.y}px`
      }

      animationId = requestAnimationFrame(animate)
    }

    document.documentElement.classList.add("has-smooth-cursor")
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseover", handlePointerOver)
    document.addEventListener("mouseout", handlePointerOut)
    animationId = requestAnimationFrame(animate)

    return () => {
      document.documentElement.classList.remove("has-smooth-cursor")
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseover", handlePointerOver)
      document.removeEventListener("mouseout", handlePointerOut)
      cancelAnimationFrame(animationId)
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9998] hidden md:block"
    >
      <div
        ref={dotRef}
        className="absolute size-2 rounded-full bg-black dark:bg-white"
        style={{
          transform: "translate(-50%, -50%)",
          left: "-100px",
          top: "-100px",
          willChange: "left, top",
        }}
      />
      <div
        ref={borderRef}
        className="absolute size-7 rounded-full border border-black dark:border-white"
        style={{
          transform: "translate(-50%, -50%)",
          left: "-100px",
          top: "-100px",
          transition: "width 0.3s, height 0.3s",
          willChange: "left, top, width, height",
        }}
      />
    </div>
  )
}
