import { ArrowUpRightIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"
import { TECH_STACK } from "@/features/portfolio/data/tech-stack"
import { getProjectsByLocale } from "@/features/portfolio/data/projects"
import { Link } from "@/i18n/navigation"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

const FEATURED_IDS = [
  "multilingual-tour-platform",
  "tour-booking-platform",
  "corporate-landing-page",
] as const

export async function HirePageView({ locale }: { locale: "en" | "vi" }) {
  const t = await getTranslations("Hire")
  const projects = getProjectsByLocale(locale)
  const featured = FEATURED_IDS.map((id) =>
    projects.find((project) => project.id === id)
  ).filter(Boolean)

  const stack = TECH_STACK.slice(0, 8).map((item) => item.title)

  return (
    <div className="mx-auto min-h-svh border-x border-edge md:max-w-3xl">
      <section className="screen-line-after space-y-5 px-4 py-10 sm:space-y-6 sm:px-6 sm:py-12">
        <p className="font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
          {t("label")}
        </p>
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t("headline")}
        </h1>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-pretty text-muted-foreground sm:text-[15px]">
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1">
          <Button asChild>
            <Link href="/contact">
              {t("ctaContact")}
              <ArrowUpRightIcon />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/resume">{t("ctaResume")}</Link>
          </Button>
        </div>
      </section>

      <Panel className="border-x-0">
        <PanelHeader className="px-4 py-3 sm:px-6">
          <PanelTitle className="text-2xl sm:text-3xl">
            {t("availabilityTitle")}
          </PanelTitle>
        </PanelHeader>
        <PanelContent className="space-y-3 px-4 py-5 font-mono text-sm leading-relaxed text-muted-foreground sm:px-6 sm:py-6">
          <p className="flex items-center gap-2.5 text-foreground">
            <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
            {t("availabilityStatus")}
          </p>
          <p className="pl-[18px] text-pretty">{t("availabilityNote")}</p>
        </PanelContent>
      </Panel>

      <Panel className="border-x-0">
        <PanelHeader className="px-4 py-3 sm:px-6">
          <PanelTitle className="text-2xl sm:text-3xl">
            {t("stackTitle")}
          </PanelTitle>
        </PanelHeader>
        <PanelContent className="px-4 py-5 sm:px-6 sm:py-6">
          <ul className="flex flex-wrap gap-2">
            {stack.map((skill) => (
              <li key={skill}>
                <Tag>{skill}</Tag>
              </li>
            ))}
          </ul>
        </PanelContent>
      </Panel>

      <Panel className="border-x-0">
        <PanelHeader className="px-4 py-3 sm:px-6">
          <PanelTitle className="text-2xl sm:text-3xl">
            {t("projectsTitle")}
          </PanelTitle>
        </PanelHeader>
        <PanelContent className="space-y-4 px-4 py-5 sm:space-y-5 sm:px-6 sm:py-6">
          {featured.map((project) =>
            project ? (
              <article
                key={project.id}
                className="space-y-3 border border-edge p-4 sm:space-y-3.5 sm:p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
                  <h2 className="text-lg leading-snug font-semibold tracking-tight">
                    {project.title}
                  </h2>
                  <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                    {project.period.start}
                    {project.period.end ? ` — ${project.period.end}` : ""}
                  </span>
                </div>
                <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                  {project.skills.slice(0, 5).join(" · ")}
                </p>
                <div className="pt-0.5">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${project.id}`}>
                      {t("caseStudy")}
                      <ArrowUpRightIcon />
                    </Link>
                  </Button>
                </div>
              </article>
            ) : null
          )}
        </PanelContent>
      </Panel>

      <div className="h-10 sm:h-12" />
    </div>
  )
}
