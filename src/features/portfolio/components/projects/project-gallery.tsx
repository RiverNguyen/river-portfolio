"use client"

import "swiper/css"
import "swiper/css/parallax"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useRef, useState } from "react"
import type { Swiper as SwiperInstance } from "swiper"
import { Autoplay, Parallax } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

type ProjectGalleryProps = {
  images: string[]
  title: string
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set())
  const t = useTranslations("Portfolio")
  const handleImageLoad = (index: number) => {
    setLoadedIndices((prev) => new Set([...prev, index]))
  }

  if (!images || images.length === 0) return null

  const hasMultipleImages = images.length > 1

  return (
    <div className="screen-line-after max-w-full space-y-1 overflow-hidden rounded-xl border border-edge bg-background/40">
      <div className="flex items-center justify-between px-3 pt-2 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        <span>{t("projectGallery")}</span>
        <span className="text-xs opacity-70">{t("screenshots")}</span>
      </div>

      <div className="relative max-w-full overflow-hidden">
        <Swiper
          modules={[Parallax, Autoplay]}
          slidesPerView={1}
          speed={1400}
          loop={hasMultipleImages}
          autoplay={
            hasMultipleImages
              ? {
                  delay: 3200,
                  disableOnInteraction: false,
                }
              : false
          }
          parallax
          onSwiper={(instance) => {
            swiperRef.current = instance
          }}
          className="w-full max-w-full overflow-hidden rounded-b-xl border-t border-edge/60 bg-muted/70"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} className="relative overflow-hidden">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900/60">
                {/* Skeleton: ẩn khi ảnh đã load */}
                {!loadedIndices.has(index) && (
                  <div
                    className="absolute inset-0 z-10 size-full animate-pulse rounded-b-xl bg-muted"
                    data-swiper-parallax="70%"
                    aria-hidden
                  />
                )}

                <div
                  className="absolute inset-0 size-full overflow-hidden will-change-transform"
                  data-swiper-parallax="70%"
                >
                  <Image
                    src={src}
                    alt={`${title} screenshot ${index + 1}`}
                    fill
                    quality={90}
                    priority={index === 0}
                    className="h-full w-full object-cover transition-opacity duration-300 will-change-transform"
                    style={{ opacity: loadedIndices.has(index) ? 1 : 0 }}
                    sizes="(min-width: 768px) 720px, 100vw"
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {hasMultipleImages && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[1] flex justify-center px-3">
            <div className="pointer-events-auto flex gap-2 rounded-full border border-edge/80 bg-background/95 px-2 py-1 shadow-lg shadow-black/40">
              <button
                type="button"
                aria-label="Previous screenshot"
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <ChevronLeftIcon className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next screenshot"
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <ChevronRightIcon className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
