import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"

import { ProjectArchive } from "@/features/portfolio/components/projects/project-archive"
import { getProjectsByLocale } from "@/features/portfolio/data/projects"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProjectsPage")

  return createPageMetadata({
    path: "/projects",
    title: t("title"),
    description: t("description"),
    type: "website",
  })
}

export default async function Page() {
  const locale = await getLocale()
  const t = await getTranslations("ProjectsPage")
  const projects = getProjectsByLocale(locale === "vi" ? "vi" : "en")

  return (
    <div className="min-h-svh">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold">
          {t("title")}
          <sup className="ml-1 font-mono text-sm font-medium text-muted-foreground select-none">
            ({projects.length})
          </sup>
        </h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="screen-line-before">
        <ProjectArchive projects={projects} />
      </div>

      <div className="h-4" />
    </div>
  )
}
