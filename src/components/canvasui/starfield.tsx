"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface StarfieldBackgroundProps {
  className?: string
  children?: React.ReactNode
  /** Number of stars */
  count?: number
  /** Travel speed */
  speed?: number
  /** Star color */
  starColor?: string
  /** Enable twinkling */
  twinkle?: boolean
  /** Freeze the canvas loop (keeps last frame). */
  paused?: boolean
}

interface Star {
  x: number
  y: number
  z: number
  twinkleSpeed: number
  twinkleOffset: number
}

export function StarfieldBackground({
  className,
  children,
  count = 160,
  speed = 0.45,
  starColor = "#ffffff",
  twinkle = true,
  paused = false,
}: StarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    let width = 0
    let height = 0
    let animationId = 0
    let tick = 0
    let running = true
    const maxDepth = 1500

    const createStar = (): Star => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * maxDepth,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
    })

    let stars: Star[] = []

    const resize = () => {
      const rect = container.getBoundingClientRect()
      // Cap DPR — full retina + hundreds of arcs is what makes the exit feel laggy.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (stars.length !== count) {
        stars = Array.from({ length: count }, createStar)
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const animate = () => {
      if (!running) return
      if (pausedRef.current) {
        animationId = requestAnimationFrame(animate)
        return
      }

      tick++
      ctx.fillStyle = "rgba(10, 10, 15, 0.28)"
      ctx.fillRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2
      ctx.fillStyle = starColor

      for (const star of stars) {
        star.z -= speed * 2
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width * 2
          star.y = (Math.random() - 0.5) * height * 2
          star.z = maxDepth
        }

        const scale = 400 / star.z
        const x = cx + star.x * scale
        const y = cy + star.y * scale
        if (x < -4 || x > width + 4 || y < -4 || y > height + 4) continue

        const depth = 1 - star.z / maxDepth
        const size = Math.max(0.6, depth * 2.4)
        let opacity = depth * 0.85 + 0.12
        if (twinkle && star.twinkleSpeed > 0.015) {
          opacity *=
            0.75 + 0.25 * Math.sin(tick * star.twinkleSpeed + star.twinkleOffset)
        }

        ctx.globalAlpha = opacity
        // fillRect is much cheaper than arc() for this many points
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    ctx.fillStyle = "#0a0a0f"
    ctx.fillRect(0, 0, width, height)
    animationId = requestAnimationFrame(animate)

    return () => {
      running = false
      cancelAnimationFrame(animationId)
      ro.disconnect()
    }
  }, [count, speed, starColor, twinkle])

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden bg-[#0a0a0f]", className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(56, 100, 180, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(100, 60, 150, 0.08) 0%, transparent 50%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 45%, rgba(5,5,10,0.88) 100%)",
        }}
      />

      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : null}
    </div>
  )
}

export default function StarfieldBackgroundDemo() {
  return <StarfieldBackground className="fixed inset-0" />
}
