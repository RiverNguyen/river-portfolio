import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import type { BreadcrumbList, CreativeWork, WithContext } from "schema-dts"

import { CaseStudyView } from "@/features/portfolio/components/projects/case-study-view"
import {
  getAllCaseStudySlugs,
  getCaseStudyBySlug,
} from "@/features/portfolio/data/case-studies"
import { USER } from "@/features/portfolio/data/user"
import { createPageMetadata, getAbsoluteUrl, getLocalizedUrl } from "@/lib/seo"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const study = getCaseStudyBySlug(slug, locale === "vi" ? "vi" : "en")

  if (!study) {
    return {}
  }

  return createPageMetadata({
    path: `/projects/${study.slug}`,
    title: study.title,
    description: study.tagline,
    image: study.coverImage,
    type: "article",
  })
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const t = await getTranslations("ProjectsPage")
  const study = getCaseStudyBySlug(slug, locale === "vi" ? "vi" : "en")

  if (!study) {
    notFound()
  }

  const pageUrl = getLocalizedUrl(`/projects/${study.slug}`, locale)
  const creativeWork: WithContext<CreativeWork> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    description: study.tagline,
    url: pageUrl,
    author: {
      "@type": "Person",
      name: USER.displayName,
      url: getLocalizedUrl("/", locale),
    },
    creator: {
      "@type": "Person",
      name: USER.displayName,
    },
    keywords: study.skills.join(", "),
    ...(study.coverImage ? { image: getAbsoluteUrl(study.coverImage) } : {}),
    isAccessibleForFree: true,
  }
  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "vi" ? "Trang chủ" : "Home",
        item: getLocalizedUrl("/", locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("title"),
        item: getLocalizedUrl("/projects", locale),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: study.title,
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(creativeWork).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <CaseStudyView study={study} />
    </>
  )
}
