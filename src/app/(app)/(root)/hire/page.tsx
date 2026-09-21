import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"

import { HirePageView } from "@/features/portfolio/components/hire-page-view"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Hire")

  return createPageMetadata({
    path: "/hire",
    title: t("metaTitle"),
    description: t("metaDescription"),
    type: "website",
  })
}

export default async function Page() {
  const locale = await getLocale()
  const portfolioLocale = locale === "vi" ? "vi" : "en"

  return <HirePageView locale={portfolioLocale} />
}
