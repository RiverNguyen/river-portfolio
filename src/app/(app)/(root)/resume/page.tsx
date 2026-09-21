import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"

import { ResumePageContent } from "@/features/resume/components/resume-page-content"
import { getResumeByLocale } from "@/features/resume/data/resume"
import { getUserByLocale } from "@/features/portfolio/data/user"
import { getPersonJsonLd } from "@/lib/person-jsonld"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations("Resume")
  const user = getUserByLocale(locale === "vi" ? "vi" : "en")

  return createPageMetadata({
    path: "/resume",
    title: t("title"),
    description:
      locale === "vi"
        ? `${user.displayName} — CV và kinh nghiệm làm việc.`
        : `${user.displayName} — Frontend Developer resume and CV.`,
    type: "profile",
  })
}

export default async function Page() {
  const locale = await getLocale()
  const t = await getTranslations("Resume")
  const portfolioLocale = locale === "vi" ? "vi" : "en"
  const resume = getResumeByLocale(portfolioLocale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getPersonJsonLd(portfolioLocale, { pagePath: "/resume" })
          ).replace(/</g, "\\u003c"),
        }}
      />
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
    </>
  )
}
