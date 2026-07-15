import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"

import { ResumePageContent } from "@/features/resume/components/resume-page-content"
import { getResumeByLocale } from "@/features/resume/data/resume"
import { USER } from "@/features/portfolio/data/user"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations("Resume")

  return createPageMetadata({
    path: "/resume",
    title: t("title"),
    description: `${USER.displayName} — ${locale === "vi" ? "CV và kinh nghiệm làm việc" : "Frontend Developer resume and CV"}.`,
    type: "profile",
  })
}

export default async function Page() {
  const locale = await getLocale()
  const t = await getTranslations("Resume")
  const resume = getResumeByLocale(locale === "vi" ? "vi" : "en")

  return (
    <ResumePageContent
      resume={resume}
      labels={{
        objective: t("objective"),
        experience: t("experience"),
        skills: t("skills"),
        projects: t("projects"),
        education: t("education"),
        technologies: t("technologies"),
        responsibilities: t("responsibilities"),
        downloadPdf: t("downloadPdf"),
        print: t("print"),
      }}
    />
  )
}
