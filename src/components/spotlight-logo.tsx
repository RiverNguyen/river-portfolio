"use client"

import type { Transition } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { useEffect, useId, useRef } from "react"

import { useSound } from "@/hooks/soundcn/use-sound"
import { metalClickSound } from "@/lib/metal-click"

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
}

const viewBox = { x: 6, y: 115, width: 544, height: 124 }

const nPath =
  "M 117.07 125.13 L 139.53 138.1 L 128.3 144.58 L 139.53 151.06 L 117.07 164.03 L 128.3 170.52 L 117.07 177 L 128.3 183.48 L 173.22 157.55 L 195.68 170.52 L 94.61 228.87 L 72.15 215.9 L 83.38 209.42 L 72.15 202.94 L 94.61 189.97 L 83.38 183.48 L 105.84 170.52 L 94.61 164.03 L 38.46 196.45 L 16 183.48 L 117.07 125.13 Z"

const dPath =
  "M 289.23 138.1 L 244.31 164.03 L 289.23 189.97 L 334.15 164.03 L 356.61 177 L 289.23 215.9 L 199.39 164.03 L 266.77 125.13 L 289.23 138.1 Z M 356.61 151.06 L 334.15 164.03 L 289.23 138.1 L 311.69 125.13 L 356.61 151.06 Z M 289.23 215.9 L 199.39 164.03 V 177 L 289.23 228.87 L 356.61 189.97 V 177 L 289.23 215.9 Z M 289.23 138.1 L 244.31 164.03 V 177 L 289.23 151.06 L 334.15 177 L 356.61 164.03 V 151.06 L 334.15 164.03 L 289.23 138.1 Z"

const gPath =
  "M 475.83 125.13 L 540 162.18 L 527.16 169.59 L 540 177 L 527.16 184.41 L 501.5 169.59 L 514.33 162.18 L 475.83 139.95 L 385.99 191.82 L 424.49 214.05 L 450.16 199.23 L 437.32 191.82 L 450.16 184.41 L 488.66 206.64 L 450.16 228.87 L 437.32 221.46 L 424.49 228.87 L 360.32 191.82 L 373.15 184.41 L 360.32 177 L 450.16 125.13 L 462.99 132.54 L 475.83 125.13 Z"

const nPressed =
  "M 117.07 128.37 L 139.53 141.34 L 128.3 147.82 L 139.53 154.3 L 117.07 167.27 L 128.3 173.76 L 117.07 180.24 L 128.3 186.72 L 173.22 160.79 L 195.68 173.76 L 94.61 232.11 L 72.15 219.14 L 83.38 212.66 L 72.15 206.18 L 94.61 193.21 L 83.38 186.72 L 105.84 173.76 L 94.61 167.27 L 38.46 199.69 L 16 186.72 L 117.07 128.37 Z"

const dPressed =
  "M 289.23 141.34 L 244.31 167.27 L 289.23 193.21 L 334.15 167.27 L 356.61 180.24 L 289.23 219.14 L 199.39 167.27 L 266.77 128.37 L 289.23 141.34 Z M 356.61 154.3 L 334.15 167.27 L 289.23 141.34 L 311.69 128.37 L 356.61 154.3 Z M 289.23 219.14 L 199.39 167.27 V 180.24 L 289.23 232.11 L 356.61 193.21 V 180.24 L 289.23 219.14 Z M 289.23 141.34 L 244.31 167.27 V 180.24 L 289.23 154.3 L 334.15 180.24 L 356.61 167.27 V 154.3 L 334.15 167.27 L 289.23 141.34 Z"

const gPressed =
  "M 475.83 128.37 L 540 165.42 L 527.16 172.83 L 540 180.24 L 527.16 187.65 L 501.5 172.83 L 514.33 165.42 L 475.83 143.19 L 385.99 195.06 L 424.49 217.29 L 450.16 202.47 L 437.32 195.06 L 450.16 187.65 L 488.66 209.88 L 450.16 232.11 L 437.32 224.7 L 424.49 232.11 L 360.32 195.06 L 373.15 187.65 L 360.32 180.24 L 450.16 128.37 L 462.99 135.78 L 475.83 128.37 Z"

const strokeNormal = `${nPath} ${dPath} ${gPath}`
const strokePressed = `${nPressed} ${dPressed} ${gPressed}`

/**
 * Isometric NDG mark with a cursor-following gradient highlight, spring press
 * effect, and tactile click sound.
 */
export function SpotlightLogo() {
  const id = useId()
  const ids = {
    facePattern: `spotlight-logo-face-pattern-${id}`,
    faceFill: `spotlight-logo-face-fill-${id}`,
    stroke: `spotlight-logo-stroke-${id}`,
    radialGradient: `spotlight-logo-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)

  const [play] = useSound(metalClickSound)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(
    useTransform(
      mouseX,
      [0, 1],
      [viewBox.x, viewBox.x + viewBox.width]
    ),
    {
      stiffness: 300,
      damping: 30,
      mass: 0.1,
    }
  )

  const cy = useSpring(
    useTransform(
      mouseY,
      [0, 1],
      [viewBox.y, viewBox.y + viewBox.height]
    ),
    {
      stiffness: 300,
      damping: 30,
      mass: 0.1,
    }
  )

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return
    }

    if (window.matchMedia("(hover: none)").matches) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className="h-auto w-full touch-manipulation [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]"
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        <motion.g
          id={ids.faceFill}
          fillRule="evenodd"
          clipRule="evenodd"
          variants={{
            normal: {
              transform: "translate(0px, 0px)",
            },
            pressed: {
              transform: "translate(0px, 14px)",
            },
          }}
          transition={transition}
        >
          <motion.path
            variants={{
              normal: { d: nPath },
              pressed: { d: nPressed },
            }}
            transition={transition}
          />
          <motion.path
            variants={{
              normal: { d: dPath },
              pressed: { d: dPressed },
            }}
            transition={transition}
          />
          <motion.path
            variants={{
              normal: { d: gPath },
              pressed: { d: gPressed },
            }}
            transition={transition}
          />
        </motion.g>

        <motion.path
          id={ids.stroke}
          fillRule="evenodd"
          variants={{
            normal: { d: strokeNormal },
            pressed: { d: strokePressed },
          }}
          transition={transition}
        />

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="dark:[stop-color:#fff]"
            stopColor="var(--color-zinc-700)"
          />
          <stop
            className="dark:[stop-color:var(--color-zinc-600)]"
            offset="1"
            stopColor="var(--color-zinc-400)"
            stopOpacity="0"
          />
        </motion.radialGradient>
      </defs>

      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />

      <use
        href={`#${ids.stroke}`}
        stroke="var(--stroke)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <use
        href={`#${ids.stroke}`}
        stroke={`url(#${ids.radialGradient})`}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}
