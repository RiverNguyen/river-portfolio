import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import type { ProfilePage as PageSchema, WithContext } from "schema-dts"

import { getUserByLocale } from "@/features/portfolio/data/user"
import { ResumePageContent } from "@/features/resume/components/resume-page-content"
import { getResumeByLocale } from "@/features/resume/data/resume"
import { getPersonJsonLd } from "@/lib/person-jsonld"
import { createPageMetadata, getLocalizedUrl } from "@/lib/seo"

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
  const user = getUserByLocale(portfolioLocale)

  const jsonLd: WithContext<PageSchema> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${user.displayName} — Resume`,
    url: getLocalizedUrl("/resume", portfolioLocale),
    inLanguage: portfolioLocale,
    mainEntity: getPersonJsonLd(portfolioLocale),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
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
