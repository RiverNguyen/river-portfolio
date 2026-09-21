"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { useRouter } from "@/i18n/navigation"

export function HireModeRedirect() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("mode") === "hire") {
      router.replace("/hire")
    }
  }, [router, searchParams])

  return null
}
