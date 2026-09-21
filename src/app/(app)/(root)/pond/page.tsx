import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pond")

  return createPageMetadata({
    path: "/pond",
    title: t("metaTitle"),
    description: t("metaDescription"),
    type: "website",
  })
}

export default async function Page() {
  const t = await getTranslations("Pond")

  return (
    <div className="min-h-svh px-4 py-12">
      <div className="mx-auto max-w-lg space-y-6 border border-edge p-6 sm:p-8">
        <p className="font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
          {t("label")}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="font-mono text-sm leading-relaxed text-muted-foreground">
          {t("body")}
        </p>
        <Link
          href="/"
          className="inline-flex font-mono text-xs tracking-wider text-foreground uppercase underline-offset-4 hover:underline"
        >
          {t("back")}
        </Link>
      </div>
    </div>
  )
}
