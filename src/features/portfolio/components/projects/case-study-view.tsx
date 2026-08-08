import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

import { Markdown } from "@/components/markdown"
import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"
import { ProseMono } from "@/components/ui/typography"
import { UTM_PARAMS } from "@/config/site"
import type { CaseStudy } from "@/features/portfolio/data/case-studies"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { addQueryParams } from "@/utils/url"

import { ProjectGallery } from "./project-gallery"

export async function CaseStudyView({ study }: { study: CaseStudy }) {
  const t = await getTranslations("CaseStudy")

  return (
    <article className="min-h-svh">
      <div className="screen-line-after flex items-center justify-between gap-3 px-4">
        <Button variant="ghost" size="sm" className="-ml-2 px-2" asChild>
          <Link href="/projects">
            <ArrowLeftIcon />
            {t("backToProjects")}
          </Link>
        </Button>

        <a
          href={addQueryParams(study.liveUrl, UTM_PARAMS)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("viewLive")}
          <ArrowUpRightIcon className="size-3.5" />
        </a>
      </div>

      <header className="space-y-4 px-4 py-6 sm:py-8">
        <p className="font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
          {t("label")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {study.title}
        </h1>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-balance text-muted-foreground sm:text-[15px]">
          {study.tagline}
        </p>

        <dl className="grid grid-cols-2 gap-4 border-t border-edge pt-4 font-mono text-xs sm:grid-cols-3">
          <div>
            <dt className="tracking-wider text-muted-foreground uppercase">
              {t("role")}
            </dt>
            <dd className="mt-1 text-foreground">{study.role}</dd>
          </div>
          <div>
            <dt className="tracking-wider text-muted-foreground uppercase">
              {t("period")}
            </dt>
            <dd className="mt-1 text-foreground">{study.period}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="tracking-wider text-muted-foreground uppercase">
              {t("stack")}
            </dt>
            <dd className="mt-1 text-foreground">
              {study.skills.slice(0, 3).join(" · ")}
            </dd>
          </div>
        </dl>
      </header>

      <div className="screen-line-before screen-line-after border-x-0">
        <div className="relative aspect-16/10 overflow-hidden bg-muted sm:aspect-2/1">
          <Image
            src={study.coverImage}
            alt={study.title}
            fill
            priority
            quality={90}
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </div>

      <section className="space-y-3 px-4 py-6">
        <h2 className="font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
          {t("summary")}
        </h2>
        <ProseMono>
          <p>{study.summary}</p>
        </ProseMono>
      </section>

      {study.sections.map((section, index) => (
        <section
          key={section.title}
          className={cn("space-y-3 px-4 py-6", "screen-line-before")}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight">
              {section.title}
            </h2>
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <ProseMono>
            <Markdown>{section.body}</Markdown>
          </ProseMono>
        </section>
      ))}

      {study.metrics.length > 0 ? (
        <section className="screen-line-before px-4 py-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight">
              {t("metrics")}
            </h2>
            <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              {t("metricsNote")}
            </p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-edge border border-edge sm:grid-cols-4 sm:divide-y-0">
            {study.metrics.map((metric) => (
              <div key={`${metric.label}-${metric.value}`} className="space-y-2 px-4 py-4">
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {metric.label}
                </p>
                <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-[1.75rem]">
                  {metric.value}
                </p>
                {metric.note ? (
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {metric.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="screen-line-before space-y-4 px-4 py-6">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("outcomes")}
        </h2>
        <ul className="space-y-2">
          {study.outcomes.map((item) => (
            <li
              key={item}
              className="flex gap-3 border-b border-edge/60 py-2.5 last:border-b-0"
            >
              <span className="mt-2 size-1 shrink-0 bg-foreground/70" />
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                <span className="text-foreground">{item}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {study.images.length > 0 && (
        <section className="screen-line-before space-y-4 px-4 py-6">
          <h2 className="text-xl font-semibold tracking-tight">
            {t("gallery")}
          </h2>
          <ProjectGallery images={study.images} title={study.title} />
        </section>
      )}

      <section className="screen-line-before space-y-3 px-4 py-6">
        <h2 className="font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
          {t("tech")}
        </h2>
        <ul className="flex flex-wrap gap-1.5">
          {study.skills.map((skill) => (
            <li key={skill} className="flex">
              <Tag>{skill}</Tag>
            </li>
          ))}
        </ul>
      </section>

      <div className="screen-line-before flex flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md font-mono text-sm text-muted-foreground">
          {t("ctaNote")}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/projects">{t("backToProjects")}</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">
              {t("ctaContact")}
              <ArrowUpRightIcon />
            </Link>
          </Button>
        </div>
      </div>

      <div className="h-4" />
    </article>
  )
}
