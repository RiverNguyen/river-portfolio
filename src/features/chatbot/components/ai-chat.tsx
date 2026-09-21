"use client"

import {
  Loader2Icon,
  RefreshCwIcon,
  SendHorizonalIcon,
  SquareIcon,
  XIcon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useId, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ChatMascotAvatar } from "@/features/chatbot/components/chat-mascot-avatar"
import { cn } from "@/lib/utils"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
}

function ChatMarkdown({ text, isUser }: { text: string; isUser?: boolean }) {
  if (isUser) {
    return <p className="whitespace-pre-wrap">{text}</p>
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="mb-2 text-pretty last:mb-0">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="text-pretty">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
            {children}
          </code>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

export function AiChat() {
  const t = useTranslations("Chat")
  const locale = useLocale()
  const idPrefix = useId()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const counterRef = useRef(0)

  function nextId(role: string) {
    counterRef.current += 1
    return `${idPrefix}-${role}-${counterRef.current}`
  }

  useEffect(() => {
    if (!open) return
    const node = listRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, open, busy])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    setError(null)
    setInput("")

    const userMessage: ChatMessage = {
      id: nextId("user"),
      role: "user",
      text: trimmed,
    }
    const assistantId = nextId("assistant")

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: "assistant", text: "" },
    ])
    setBusy(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const history = [...messages, userMessage].map((message) => ({
        role: message.role,
        parts: [{ type: "text" as const, text: message.text }],
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, locale }),
        signal: controller.signal,
      })

      if (!response.ok) {
        let message = t("error")
        try {
          const data = (await response.json()) as { error?: string }
          if (data.error) message = data.error
        } catch {
          // keep default
        }
        throw new Error(message)
      }

      if (!response.body) {
        throw new Error(t("error"))
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assembled = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assembled += decoder.decode(value, { stream: true })
        const snapshot = assembled
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, text: snapshot }
              : message
          )
        )
      }

      assembled += decoder.decode()
      if (!assembled.trim()) {
        throw new Error(t("error"))
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? { ...message, text: assembled.trim() }
            : message
        )
      )
    } catch (err) {
      if (controller.signal.aborted) {
        setMessages((prev) =>
          prev.filter(
            (message) =>
              !(message.id === assistantId && message.text.trim() === "")
          )
        )
      } else {
        console.error("[AiChat]", err)
        setError(err instanceof Error ? err.message : t("error"))
        setMessages((prev) =>
          prev.filter((message) => message.id !== assistantId)
        )
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null
      setBusy(false)
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    await send(input)
  }

  function onStop() {
    abortRef.current?.abort()
  }

  function onReset() {
    onStop()
    setMessages([])
    setError(null)
    setInput("")
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-4 lg:p-8",
        "[--bottom:1rem] lg:[--bottom:2rem]",
        "pb-[calc(var(--bottom)+env(safe-area-inset-bottom,0px))]"
      )}
    >
      <div className="pointer-events-auto flex max-w-full flex-col items-end gap-3">
        {open ? (
          <div
            className={cn(
              "flex h-[min(32rem,calc(100dvh-6.5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden",
              "rounded-2xl border border-edge bg-background shadow-[0_24px_80px_rgba(0,0,0,0.28)] ring-1 ring-black/5 dark:ring-white/10"
            )}
            role="dialog"
            aria-label={t("title")}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-edge px-3 py-2.5">
              <ChatMascotAvatar className="size-9" size={28} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t("title")}</p>
                <p className="truncate font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  {t("subtitle")}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onReset}
                aria-label={t("reset")}
              >
                <RefreshCwIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
              >
                <XIcon />
              </Button>
            </div>

            <div
              ref={listRef}
              data-lenis-prevent
              className="min-h-0 flex-1 touch-pan-y space-y-3 overflow-y-auto overscroll-contain px-3 py-3"
            >
              {messages.length === 0 ? (
                <div className="space-y-3 rounded-xl border border-dashed border-edge bg-muted/20 p-3">
                  <p className="text-sm text-pretty text-muted-foreground">
                    {t("welcome")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[t("suggestion1"), t("suggestion2"), t("suggestion3")].map(
                      (suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            void send(suggestion)
                          }}
                          className="rounded-md border border-edge bg-background px-2 py-1 text-left font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                        >
                          {suggestion}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : null}

              {messages.map((message) => {
                if (!message.text && message.role === "assistant" && busy) {
                  return null
                }
                if (!message.text) return null
                const isUser = message.role === "user"

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[92%] rounded-xl px-3 py-2 text-sm",
                      isUser
                        ? "ml-auto bg-foreground text-background"
                        : "mr-auto border border-edge bg-background text-foreground"
                    )}
                  >
                    {!isUser ? (
                      <p className="mb-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                        {t("assistantLabel")}
                      </p>
                    ) : null}
                    <ChatMarkdown text={message.text} isUser={isUser} />
                  </div>
                )
              })}

              {busy &&
              !messages.some(
                (message) => message.role === "assistant" && message.text
              ) ? (
                <Marker variant="separator" className="py-1" role="status">
                  <MarkerIcon>
                    <Loader2Icon className="animate-spin" />
                  </MarkerIcon>
                  <MarkerContent className="shimmer font-mono text-[11px] tracking-wider uppercase">
                    {t("thinking")}
                  </MarkerContent>
                </Marker>
              ) : null}

              {error ? (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </div>

            <form
              onSubmit={onSubmit}
              className="flex shrink-0 items-end gap-2 border-t border-edge p-2.5"
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t("placeholder")}
                rows={1}
                maxLength={2000}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    void onSubmit(event)
                  }
                }}
                className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              {busy ? (
                <Button
                  type="button"
                  size="icon-lg"
                  variant="secondary"
                  onClick={onStop}
                  aria-label={t("stop")}
                >
                  <SquareIcon className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon-lg"
                  disabled={!input.trim()}
                  aria-label={t("send")}
                >
                  <SendHorizonalIcon className="size-4" />
                </Button>
              )}
            </form>
          </div>
        ) : null}

        <div className="flex items-end gap-2">
          <ScrollToTop docked />

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? t("close") : t("open")}
            title={open ? t("close") : t("launcherHint")}
            className={cn(
              "group/chat-fab relative flex items-center outline-none select-none",
              "transition-[box-shadow,background-color,border-color,color] duration-200 ease-out",
              "focus-visible:ring-[3px] focus-visible:ring-ring/50",
              open
                ? "size-11 justify-center rounded-xl border border-edge bg-secondary text-secondary-foreground hover:bg-secondary/80"
                : cn(
                    "h-12 gap-2.5 rounded-2xl border border-edge bg-background pr-3.5 pl-1.5",
                    "shadow-[0_12px_36px_rgba(0,0,0,0.22)]",
                    "hover:border-foreground/25 hover:bg-muted/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.28)]",
                    "dark:bg-background/95"
                  )
            )}
          >
            {open ? (
              <XIcon className="size-5" />
            ) : (
              <>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-1 -z-1 rounded-[1.15rem] border border-foreground/10 opacity-60 transition-opacity duration-300 group-hover/chat-fab:opacity-100"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-1 -z-1 animate-pulse rounded-[1.15rem] bg-foreground/[0.03]"
                />
                <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_55%),linear-gradient(180deg,color-mix(in_oklab,var(--muted)_70%,transparent),transparent)] ring-1 ring-foreground/8">
                  <ChatMascotAvatar size={34} className="size-full" />
                  <span className="absolute top-1 right-1 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                </span>
                <span className="flex min-w-0 flex-col items-start pr-0.5">
                  <span className="font-mono text-[10px] leading-none tracking-[0.22em] text-muted-foreground uppercase">
                    {t("assistantLabel")}
                  </span>
                  <span className="mt-1 text-sm leading-none font-medium text-foreground">
                    {t("launcherCta")}
                  </span>
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
