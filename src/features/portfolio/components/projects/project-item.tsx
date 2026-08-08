import { BoxIcon, InfinityIcon, LinkIcon, NotebookTextIcon } from "lucide-react"
import Image from "next/image"

import { Markdown } from "@/components/markdown"
import {
  CollapsibleChevronsIcon,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
} from "@/components/ui/collapsible"
import { Tag } from "@/components/ui/tag"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProseMono } from "@/components/ui/typography"
import { UTM_PARAMS } from "@/config/site"
import { Link } from "@/i18n/navigation"
import { addQueryParams } from "@/utils/url"

import type { Project } from "../../types/projects"
import { ProjectGallery } from "./project-gallery"

export function ProjectItem({
  className,
  project,
  caseStudyLabel = "Case study",
}: {
  className?: string
  project: Project
  caseStudyLabel?: string
}) {
  const { start, end } = project.period
  const isOngoing = !end
  const isSinglePeriod = end === start

  return (
    <CollapsibleWithContext defaultOpen={project.isExpanded} asChild>
      <div className={className}>
        <div className="flex items-center hover:bg-accent-muted">
          {project.logo ? (
            <Image
              src={project.logo}
              alt={project.title}
              width={32}
              height={32}
              quality={100}
              className="mx-4 flex size-6 shrink-0 select-none object-cover"
              unoptimized
              aria-hidden="true"
            />
          ) : (
            <div
              className="mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-edge ring-offset-1 ring-offset-background select-none"
              aria-hidden="true"
            >
              <BoxIcon className="size-4" />
            </div>
          )}

          <div className="flex flex-1 items-center border-l border-dashed border-edge">
            <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-2 p-4 pr-2 text-left">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="leading-snug font-medium text-balance">
                    {project.title}
                  </h3>
                  {project.caseStudySlug ? (
                    <span className="rounded-sm border border-edge px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                      {caseStudyLabel}
                    </span>
                  ) : null}
                </div>

                <dl className="text-sm text-muted-foreground">
                  <dt className="sr-only">Period</dt>
                  <dd className="flex items-center gap-0.5">
                    <span>{start}</span>
                    {!isSinglePeriod && (
                      <>
                        <span className="font-mono">—</span>
                        {isOngoing ? (
                          <>
                            <InfinityIcon
                              className="size-4.5 translate-y-[0.5px]"
                              aria-hidden
                            />
                            <span className="sr-only">Present</span>
                          </>
                        ) : (
                          <span>{end}</span>
                        )}
                      </>
                    )}
                  </dd>
                </dl>
              </div>

              <div
                className="shrink-0 text-muted-foreground [&_svg]:size-4"
                aria-hidden
              >
                <CollapsibleChevronsIcon />
              </div>
            </CollapsibleTrigger>

            <div className="flex shrink-0 items-center gap-0.5 pr-2">
              {project.caseStudySlug ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Link
                        className="relative flex size-6 items-center justify-center text-muted-foreground after:absolute after:-inset-2 hover:text-foreground"
                        href={`/projects/${project.caseStudySlug}`}
                        aria-label={caseStudyLabel}
                      >
                        <NotebookTextIcon className="pointer-events-none size-4" />
                      </Link>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{caseStudyLabel}</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}

              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    className="relative flex size-6 items-center justify-center text-muted-foreground after:absolute after:-inset-2 hover:text-foreground"
                    href={addQueryParams(project.link, UTM_PARAMS)}
                    target="_blank"
                    rel="noopener"
                  >
                    <LinkIcon className="pointer-events-none size-4" />
                    <span className="sr-only">Open Project Link</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open Project Link</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <CollapsibleContent className="group overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="border-t border-edge">
            <div className="space-y-4 p-4 duration-300 group-data-[state=closed]:animate-fade-out group-data-[state=open]:animate-fade-in">
              {project.description && (
                <ProseMono>
                  <Markdown>{project.description}</Markdown>
                </ProseMono>
              )}

              {project.images && project.images.length > 0 && (
                <ProjectGallery images={project.images} title={project.title} />
              )}

              {project.skills.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {project.skills.map((skill, index) => (
                    <li key={index} className="flex">
                      <Tag>{skill}</Tag>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </CollapsibleWithContext>
  )
}
