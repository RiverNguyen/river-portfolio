"use client"

import { Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { Icons } from "@/components/icons"
import { reactMascot } from "@/components/mascot"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import type { GuestbookUser } from "../lib/session"

export function GuestbookForm({ user }: { user: GuestbookUser | null }) {
  const t = useTranslations("Guestbook")
  const locale = useLocale()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  if (!user) {
    return (
      <Button asChild>
        <a href={`/api/guestbook/auth/signin?locale=${locale}`}>
          <Icons.github />
          {t("signIn")}
        </a>
      </Button>
    )
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        toast.error(data.error ?? t("error"))
        return
      }
      setMessage("")
      reactMascot("heart")
      router.refresh()
    } catch {
      toast.error(t("error"))
    } finally {
      setBusy(false)
    }
  }

  const signOut = async () => {
    await fetch("/api/guestbook/auth/signout", { method: "POST" })
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={280}
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        required
      />
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-muted-foreground">
          {t("signedInAs", { login: user.login })}{" "}
          <button
            type="button"
            onClick={signOut}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {t("signOut")}
          </button>
        </p>
        <Button type="submit" disabled={busy || !message.trim()}>
          {busy && <Loader2Icon className="animate-spin" />}
          {t("submit")}
        </Button>
      </div>
    </form>
  )
}

export function GuestbookDeleteButton({ id }: { id: string }) {
  const t = useTranslations("Guestbook")
  const router = useRouter()

  return (
    <button
      type="button"
      className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
      onClick={async () => {
        const res = await fetch("/api/guestbook", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        if (res.ok) router.refresh()
        else toast.error(t("error"))
      }}
    >
      {t("delete")}
    </button>
  )
}
