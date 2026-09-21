"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const

function pixelToast(enabled: boolean) {
  const vi = document.documentElement.lang?.startsWith("vi")
  if (enabled) {
    toast(vi ? "Pixel mode bật" : "Pixel mode on")
  } else {
    toast(vi ? "Pixel mode tắt" : "Pixel mode off")
  }
}

export function PixelModeListener() {
  const indexRef = useRef(0)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const expected = KONAMI[indexRef.current]
      if (event.key === expected) {
        indexRef.current += 1
        if (indexRef.current === KONAMI.length) {
          indexRef.current = 0
          const root = document.documentElement
          const enabled = root.classList.toggle("pixel-mode")
          try {
            localStorage.setItem("pixel-mode", enabled ? "1" : "0")
          } catch {
            // ignore
          }
          pixelToast(enabled)
        }
        return
      }
      indexRef.current = event.key === KONAMI[0] ? 1 : 0
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    try {
      if (localStorage.getItem("pixel-mode") === "1") {
        document.documentElement.classList.add("pixel-mode")
      }
    } catch {
      // ignore
    }
  }, [])

  return null
}
