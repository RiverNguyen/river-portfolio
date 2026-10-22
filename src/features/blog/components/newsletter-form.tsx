"use client"

import { Loader2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { reactMascot } from "@/components/mascot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterForm() {
  const t = useTranslations("Newsletter")
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        toast.error(data.error ?? t("error"))
        return
      }
      setDone(true)
      reactMascot("heart")
    } catch {
      toast.error(t("error"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="screen-line-before px-4 py-6">
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <p className="mt-1 font-mono text-sm text-muted-foreground">
        {t("description")}
      </p>
      {done ? (
        <p role="status" className="mt-3 text-sm font-medium">
          {t("success")}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-3 flex gap-2">
          <Input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-label={t("emailLabel")}
          />
          <Button type="submit" disabled={busy}>
            {busy && <Loader2Icon className="animate-spin" />}
            {t("submit")}
          </Button>
        </form>
      )}
    </div>
  )
}
