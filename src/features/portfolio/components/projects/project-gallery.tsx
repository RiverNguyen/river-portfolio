"use client"

import "swiper/css"
import "swiper/css/parallax"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Image from "next/image"
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

  const handleImageLoad = (index: number) => {
    setLoadedIndices((prev) => new Set([...prev, index]))
  }

  if (!images || images.length === 0) return null

  const hasMultipleImages = images.length > 1

  return (
    <div className="space-y-1 rounded-xl border border-edge bg-background/40 screen-line-after">
      <div className="flex items-center justify-between px-3 pt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
        <span>Project gallery</span>
        <span className="text-xs opacity-70">Screenshots</span>
      </div>

      <div className="relative">
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
          className="w-full overflow-hidden rounded-b-xl border-t border-edge/60 bg-muted/70"
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
                    className="h-full w-full object-cover will-change-transform transition-opacity duration-300"
                    style={{ opacity: loadedIndices.has(index) ? 1 : 0 }}
                    sizes="(min-width: 768px) 600px, 100vw"
                    unoptimized
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {hasMultipleImages && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-3 z-[1]">
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

