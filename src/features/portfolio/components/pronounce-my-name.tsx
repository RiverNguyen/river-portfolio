"use client"

import { useCallback, useRef } from "react"

import type { VolumeIconHandle } from "@/components/animated-icons/volume"
import { VolumeIcon } from "@/components/animated-icons/volume"
import { useSoundLazy } from "@/hooks/use-sound"
import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"

function PronounceWithAudio({
  className,
  namePronunciationUrl,
}: {
  className?: string
  namePronunciationUrl: string
}) {
  const { play, preload } = useSoundLazy(namePronunciationUrl)
  const volumeIconRef = useRef<VolumeIconHandle>(null)

  return (
    <button
      type="button"
      className={cn(
        "relative text-muted-foreground transition-[color,scale] select-none hover:text-foreground active:scale-[0.9]",
        "after:absolute after:-inset-1",
        className
      )}
      onPointerEnter={() => preload()}
      onClick={() => {
        volumeIconRef.current?.startAnimation()
        play()
        trackEvent({ name: "play_name_pronunciation" })
      }}
    >
      <VolumeIcon ref={volumeIconRef} className="size-4.5" />
      <span className="sr-only">Pronounce my name</span>
    </button>
  )
}

function PronounceWithSpeech({
  className,
  spokenName,
  locale,
}: {
  className?: string
  spokenName: string
  locale: "en" | "vi"
}) {
  const volumeIconRef = useRef<VolumeIconHandle>(null)

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(spokenName)
    utterance.lang = locale === "vi" ? "vi-VN" : "en-US"
    utterance.rate = 0.92
    window.speechSynthesis.speak(utterance)
  }, [spokenName, locale])

  return (
    <button
      type="button"
      className={cn(
        "relative text-muted-foreground transition-[color,scale] select-none hover:text-foreground active:scale-[0.9]",
        "after:absolute after:-inset-1",
        className
      )}
      onClick={() => {
        volumeIconRef.current?.startAnimation()
        speak()
        trackEvent({ name: "play_name_pronunciation" })
      }}
    >
      <VolumeIcon ref={volumeIconRef} className="size-4.5" />
      <span className="sr-only">Pronounce my name</span>
    </button>
  )
}

export function PronounceMyName({
  className,
  namePronunciationUrl,
  spokenName,
  locale = "vi",
}: {
  className?: string
  namePronunciationUrl?: string
  spokenName: string
  locale?: "en" | "vi"
}) {
  if (namePronunciationUrl) {
    return (
      <PronounceWithAudio
        className={className}
        namePronunciationUrl={namePronunciationUrl}
      />
    )
  }

  return (
    <PronounceWithSpeech
      className={className}
      spokenName={spokenName}
      locale={locale}
    />
  )
}
