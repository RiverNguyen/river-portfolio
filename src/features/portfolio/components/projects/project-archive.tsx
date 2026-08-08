"use client"

import { ArrowUpRightIcon, BoxIcon, InfinityIcon, NotebookTextIcon } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { useLenis } from "@/components/lenis-provider"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tag } from "@/components/ui/tag"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProseMono } from "@/components/ui/typography"
import { UTM_PARAMS } from "@/config/site"
import type { Project } from "@/features/portfolio/types/projects"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { addQueryParams } from "@/utils/url"

import { ProjectGallery } from "./project-gallery"
import {
  FeaturedProjectsSlider,
  pickFeaturedProjects,
} from "./featured-projects-slider"

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

function ProjectCover({
  project,
  featured,
  priority,
}: {
  project: Project
  featured?: boolean
  priority?: boolean
}) {
  const cover = project.images?.[0]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-muted select-none",
        featured ? "aspect-[16/10]" : "aspect-[4/3]"
      )}
    >
      {cover ? (
        <Image
          src={cover}
          alt={project.title}
          fill
          quality={90}
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 768px"
              : "(max-width: 768px) 100vw, 384px"
          }
          priority={priority}
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-[repeating-linear-gradient(315deg,var(--color-edge)_0,var(--color-edge)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px]">
          {project.logo ? (
            <Image
              src={project.logo}
              alt=""
              width={56}
              height={56}
              className="size-14 object-cover opacity-80"
              unoptimized
            />
          ) : (
            <BoxIcon className="size-8 text-muted-foreground" />
          )}
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
    </div>
  )
}

function ProjectArchiveCard({
  project,
  index,
  featured = false,
  priority = false,
  onOpen,
}: {
  project: Project
  index: number
  featured?: boolean
  priority?: boolean
  onOpen: (project: Project) => void
}) {
  const t = useTranslations("ProjectsPage")
  const summary = getProjectSummary(project.description)
  const indexLabel = String(index + 1).padStart(2, "0")

  return (
    <motion.button
      type="button"
      id={project.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(project)}
      className={cn(
        "group scroll-mt-24 flex w-full cursor-pointer flex-col gap-2 p-2 text-left",
        featured
          ? "screen-line-after"
          : "max-sm:screen-line-before max-sm:screen-line-after sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
    >
      <ProjectCover project={project} featured={featured} priority={priority} />

      <div className={cn("flex flex-col gap-1.5", featured ? "p-3" : "p-2")}>
        <div className="flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
          <div className="flex min-w-0 items-center gap-2">
            <span className="tabular-nums">{indexLabel}</span>
            <span className="opacity-30">/</span>
            <ProjectPeriod
              start={project.period.start}
              end={project.period.end}
            />
            {project.caseStudySlug ? (
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
        </div>

        <h2
          className={cn(
            "leading-snug font-medium text-balance underline-offset-4 group-hover:underline",
            featured ? "text-2xl" : "text-lg"
          )}
        >
          {project.title}
        </h2>

        {summary ? (
          <p className="line-clamp-2 text-sm text-pretty text-muted-foreground">
            {summary}
          </p>
        ) : null}

        {project.skills.length > 0 ? (
          <p className="truncate font-mono text-[11px] tracking-wide text-muted-foreground/80">
            {project.skills.slice(0, featured ? 5 : 3).join(" · ")}
          </p>
        ) : null}
      </div>
    </motion.button>
  )
}

function ProjectDetailDialog({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations("ProjectsPage")
  const lenis = useLenis()
  const [activeProject, setActiveProject] = useState<Project | null>(project)

  useEffect(() => {
    if (project) setActiveProject(project)
  }, [project])

  useEffect(() => {
    if (!lenis) return

    if (open) {
      lenis.stop()
      return () => {
        lenis.start()
      }
    }

    lenis.start()
  }, [lenis, open])

  if (!activeProject) return null

  const summary = getProjectSummary(activeProject.description)
  const href = addQueryParams(activeProject.link, UTM_PARAMS)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(88vh,900px)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <div
          data-lenis-prevent
          className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
        >
          <DialogHeader className="gap-3 border-b border-edge p-5 pr-12 text-left sm:p-6">
            <div className="flex min-w-0 items-start gap-3">
              {activeProject.logo ? (
                <Image
                  src={activeProject.logo}
                  alt=""
                  width={40}
                  height={40}
                  className="mt-0.5 size-10 shrink-0 object-cover"
                  unoptimized
                  aria-hidden
                />
              ) : null}

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs text-muted-foreground">
                    <ProjectPeriod
                      start={activeProject.period.start}
                      end={activeProject.period.end}
                    />
                  </p>

                  {activeProject.caseStudySlug ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/projects/${activeProject.caseStudySlug}`}
                          onClick={() => onOpenChange(false)}
                          aria-label={t("caseStudy")}
                          className="inline-flex items-center gap-1 rounded-sm border border-edge px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase transition-colors hover:border-foreground/30 hover:text-foreground"
                        >
                          <NotebookTextIcon className="size-3" />
                          {t("caseStudy")}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("caseStudy")}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>

                <DialogTitle className="text-xl text-balance sm:text-2xl">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/title inline-flex items-center gap-1.5"
                  >
                    <span className="bg-gradient-to-r from-foreground to-foreground bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover/title:bg-[length:100%_1.5px]">
                      {activeProject.title}
                    </span>
                    <ArrowUpRightIcon
                      className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 group-hover/title:text-foreground sm:size-5"
                      aria-hidden
                    />
                    <span className="sr-only">{t("viewProject")}</span>
                  </a>
                </DialogTitle>
                {summary ? (
                  <DialogDescription className="text-pretty wrap-break-word">
                    {summary}
                  </DialogDescription>
                ) : (
                  <DialogDescription className="sr-only">
                    {activeProject.title}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          {activeProject.images && activeProject.images.length > 0 ? (
            <div className="min-w-0 overflow-hidden border-b border-edge p-4 sm:p-5">
              <ProjectGallery
                images={activeProject.images}
                title={activeProject.title}
              />
            </div>
          ) : null}

          <div className="min-w-0 space-y-5 overflow-x-hidden p-5 sm:p-6">
            {activeProject.description ? (
              <ProseMono className="max-w-full wrap-break-word [&_img]:h-auto [&_img]:max-w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeProject.description}
                </ReactMarkdown>
              </ProseMono>
            ) : null}

            {activeProject.skills.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {activeProject.skills.map((skill) => (
                  <li key={skill}>
                    <Tag>{skill}</Tag>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ProjectArchive({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null)
  const [open, setOpen] = useState(false)

  if (projects.length === 0) return null

  const featured = pickFeaturedProjects(projects, 4)
  const featuredIds = new Set(featured.map((project) => project.id))
  const rest = projects.filter((project) => !featuredIds.has(project.id))

  const handleOpen = (project: Project) => {
    setSelected(project)
    setOpen(true)
  }

  return (
    <>
      <div>
        <FeaturedProjectsSlider projects={featured} onOpen={handleOpen} />

        {rest.length > 0 ? (
          <div className="relative grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <div className="pointer-events-none absolute inset-0 -z-1 hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2">
              <div className="border-r border-edge" />
              <div className="border-l border-edge" />
            </div>

            {rest.map((project, index) => (
              <ProjectArchiveCard
                key={project.id}
                project={project}
                index={featured.length + index}
                onOpen={handleOpen}
              />
            ))}
          </div>
        ) : null}
      </div>

      <ProjectDetailDialog
        project={selected}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
