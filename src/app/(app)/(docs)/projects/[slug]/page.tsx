import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale } from "next-intl/server"

import { CaseStudyView } from "@/features/portfolio/components/projects/case-study-view"
import {
  getAllCaseStudySlugs,
  getCaseStudyBySlug,
} from "@/features/portfolio/data/case-studies"
import { createPageMetadata } from "@/lib/seo"

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
  const study = getCaseStudyBySlug(slug, locale === "vi" ? "vi" : "en")

  if (!study) {
    notFound()
  }

  return <CaseStudyView study={study} />
}
