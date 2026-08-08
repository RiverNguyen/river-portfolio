"use client"

import { useChat } from "@ai-sdk/react"
import {
  Loader2Icon,
  MessageCircleIcon,
  RefreshCwIcon,
  SendHorizonalIcon,
  SquareIcon,
  XIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { cn } from "@/lib/utils"

function messageText(message: {
  parts?: Array<{ type: string; text?: string }>
}) {
  if (!message.parts?.length) return ""
  return message.parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("")
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
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const listRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    sendMessage,
    status,
    stop,
    setMessages,
    error,
    clearError,
  } = useChat({
    onError: (err) => {
      console.error("[AiChat]", err)
    },
  })

  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    if (!open) return
    const node = listRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, open, status])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    clearError()
    setInput("")
    await sendMessage({ text })
  }

  function onReset() {
    stop()
    setMessages([])
    clearError()
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
              <div className="flex size-8 items-center justify-center rounded-lg border border-edge bg-muted/40">
                <MessageCircleIcon className="size-4" />
              </div>
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
                            clearError()
                            void sendMessage({ text: suggestion })
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
                const text = messageText(message)
                if (!text) return null
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
                    <ChatMarkdown text={text} isUser={isUser} />
                  </div>
                )
              })}

              {busy ? (
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
                  {error.message || t("error")}
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
                  onClick={() => stop()}
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

        <Button
          type="button"
          size="icon-lg"
          variant={open ? "secondary" : "default"}
          className="shadow-lg"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? t("close") : t("open")}
        >
          {open ? (
            <XIcon className="size-5" />
          ) : (
            <MessageCircleIcon className="size-5" />
          )}
        </Button>
      </div>
    </div>
  )
}
