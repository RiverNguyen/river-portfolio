"use client"

import { ArrowUpRightIcon, BoxIcon, InfinityIcon } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

import type { Project } from "@/features/portfolio/types/projects"
import { cn } from "@/lib/utils"

function getProjectSummary(description?: string) {
  if (!description) return ""

  return (
    description
      .split("\n")
      .map((part) => part.trim())
      .find((part) => part.length > 0 && !part.startsWith("-")) ?? ""
  )
}

function ProjectPeriod({ start, end }: { start: string; end?: string }) {
  const isOngoing = !end
  const isSinglePeriod = end === start

  return (
    <span className="inline-flex items-center gap-0.5">
      <span>{start}</span>
      {!isSinglePeriod && (
        <>
          <span className="opacity-40">—</span>
          {isOngoing ? (
            <InfinityIcon className="size-3.5 translate-y-px" aria-hidden />
          ) : (
            <span>{end}</span>
          )}
        </>
      )}
    </span>
  )
}

const ease = [0.22, 1, 0.36, 1] as const

const imageVariants = {
  enter: {
    opacity: 0,
    scale: 1.06,
    filter: "blur(12px)",
  },
  center: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 1.04,
    filter: "blur(10px)",
  },
}

const metaContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.08 },
  },
}

const metaItem = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease },
  },
}

export function FeaturedProjectsSlider({
  projects,
  onOpen,
}: {
  projects: Project[]
  onOpen: (project: Project) => void
}) {
  const t = useTranslations("ProjectsPage")
  const reduceMotion = useReducedMotion()
  const [[page], setPage] = useState([0, 0])
  const dragStartX = useRef<number | null>(null)
  const didSwipe = useRef(false)

  const count = projects.length
  const activeIndex = ((page % count) + count) % count
  const active = projects[activeIndex]
  const hasMultiple = count > 1

  const paginate = (nextDirection: number) => {
    if (!hasMultiple) return
    setPage(([current]) => [current + nextDirection, nextDirection])
  }

  useEffect(() => {
    if (!hasMultiple || reduceMotion) return

    const id = window.setInterval(() => {
      setPage(([current]) => [current + 1, 1])
    }, 5200)

    return () => window.clearInterval(id)
  }, [page, hasMultiple, reduceMotion])

  if (!active) return null

  const summary = getProjectSummary(active.description)
  const indexLabel = String(activeIndex + 1).padStart(2, "0")
  const cover = active.images?.[0]

  return (
    <section className="screen-line-after">
      <div className="screen-line-after flex items-end justify-between gap-3 px-4 py-3">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          {t("featured")}
        </h2>
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase tabular-nums">
          {indexLabel} / {String(count).padStart(2, "0")}
        </p>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden bg-background">
        <AnimatePresence initial={false}>
          <motion.button
            key={active.id}
            type="button"
            variants={reduceMotion ? undefined : imageVariants}
            initial={reduceMotion ? false : "enter"}
            animate="center"
            exit={reduceMotion ? undefined : "exit"}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease }}
            onPointerDown={(event) => {
              if (!hasMultiple) return
              didSwipe.current = false
              dragStartX.current = event.clientX
            }}
            onPointerUp={(event) => {
              if (dragStartX.current == null) return
              const delta = event.clientX - dragStartX.current
              dragStartX.current = null
              if (Math.abs(delta) < 56) return
              didSwipe.current = true
              paginate(delta < 0 ? 1 : -1)
            }}
            onPointerCancel={() => {
              dragStartX.current = null
            }}
            onClick={() => {
              if (didSwipe.current) {
                didSwipe.current = false
                return
              }
              onOpen(active)
            }}
            className="group absolute inset-0 z-10 block size-full cursor-pointer touch-pan-y outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset"
            aria-label={active.title}
          >
            {cover ? (
              <Image
                src={cover}
                alt={active.title}
                fill
                quality={90}
                sizes="(max-width: 768px) 100vw, 768px"
                priority={activeIndex === 0}
                className="object-cover transition duration-500 ease-out group-hover:scale-[1.02]"
                draggable={false}
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-[repeating-linear-gradient(315deg,var(--color-edge)_0,var(--color-edge)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px]">
                {active.logo ? (
                  <Image
                    src={active.logo}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 object-cover opacity-80"
                    unoptimized
                    draggable={false}
                  />
                ) : (
                  <BoxIcon className="size-8 text-muted-foreground" />
                )}
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-black/10 ring-inset dark:ring-white/10" />
          </motion.button>
        </AnimatePresence>
      </div>

      {hasMultiple ? (
        <div className="flex justify-center gap-1.5 border-b border-edge px-4 py-3">
          {projects.map((project, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={project.id}
                type="button"
                aria-label={`Go to ${project.title}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => {
                  if (index === activeIndex) return
                  setPage([
                    page + (index - activeIndex),
                    index > activeIndex ? 1 : -1,
                  ])
                }}
                className={cn(
                  "h-0.5 rounded-[1px] transition-all duration-300",
                  isActive
                    ? "w-7 bg-foreground"
                    : "w-5 bg-muted-foreground/35 hover:bg-muted-foreground/60"
                )}
              />
            )
          })}
        </div>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.button
          key={active.id}
          type="button"
          id={active.id}
          onClick={() => onOpen(active)}
          variants={reduceMotion ? undefined : metaContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          exit={
            reduceMotion
              ? undefined
              : { opacity: 0, y: -8, transition: { duration: 0.2 } }
          }
          className="group flex w-full cursor-pointer flex-col gap-1.5 p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset sm:p-4"
        >
          <motion.div
            variants={reduceMotion ? undefined : metaItem}
            className="flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="tabular-nums">{indexLabel}</span>
              <span className="opacity-30">/</span>
              <ProjectPeriod
                start={active.period.start}
                end={active.period.end}
              />
              {active.caseStudySlug ? (
                <>
                  <span className="opacity-30">/</span>
                  <span className="rounded-sm border border-edge px-1.5 py-0.5 text-[10px] tracking-wider uppercase">
                    {t("caseStudy")}
                  </span>
                </>
              ) : null}
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 transition-colors group-hover:text-foreground">
              {t("viewDetails")}
              <ArrowUpRightIcon className="size-3.5" />
            </span>
          </motion.div>

          <motion.h3
            variants={reduceMotion ? undefined : metaItem}
            className="text-2xl leading-snug font-medium text-balance underline-offset-4 group-hover:underline"
          >
            {active.title}
          </motion.h3>

          {summary ? (
            <motion.p
              variants={reduceMotion ? undefined : metaItem}
              className="line-clamp-2 text-sm text-pretty text-muted-foreground"
            >
              {summary}
            </motion.p>
          ) : null}

          {active.skills.length > 0 ? (
            <motion.p
              variants={reduceMotion ? undefined : metaItem}
              className="truncate font-mono text-[11px] tracking-wide text-muted-foreground/80"
            >
              {active.skills.slice(0, 5).join(" · ")}
            </motion.p>
          ) : null}
        </motion.button>
      </AnimatePresence>
    </section>
  )
}

export function pickFeaturedProjects(projects: Project[], limit = 4) {
  const withImages = projects.filter(
    (project) => project.images && project.images.length > 0
  )
  const source = withImages.length > 0 ? withImages : projects
  return source.slice(0, Math.min(limit, source.length))
}
