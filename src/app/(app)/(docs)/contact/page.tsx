import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import type { ContactPage as ContactPageSchema, WithContext } from "schema-dts"

import { SITE_INFO } from "@/config/site"
import { Contact } from "@/features/portfolio/components/contact"
import { ContactChannels } from "@/features/portfolio/components/contact-channels"
import { SocialLinks } from "@/features/portfolio/components/social-links"
import { USER } from "@/features/portfolio/data/user"
import { createPageMetadata, getLocalizedUrl } from "@/lib/seo"
import { cn } from "@/lib/utils"
import { decodeEmail, decodePhoneNumber } from "@/utils/string"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact")

  return createPageMetadata({
    path: "/contact",
    title: t("title"),
    description: t("subtitle"),
    type: "website",
  })
}

function getContactJsonLd(locale: string): WithContext<ContactPageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `${USER.displayName} — Contact`,
    url: getLocalizedUrl("/contact", locale),
    description: SITE_INFO.description,
    mainEntity: {
      "@type": "Person",
      name: USER.displayName,
      url: SITE_INFO.url,
      email: decodeEmail(USER.email),
      telephone: decodePhoneNumber(USER.phoneNumber),
      jobTitle: USER.jobTitle,
      address: {
        "@type": "PostalAddress",
        addressLocality: USER.address,
        addressCountry: "VN",
      },
    },
  }
}

export default async function Page() {
  const locale = await getLocale()
  const t = await getTranslations("Contact")

  return (
    <div className="min-h-svh">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getContactJsonLd(locale)).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <section className="relative isolate overflow-hidden screen-line-after">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-1",
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
            "bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/45"
          )}
        />

        <div className="relative z-10 space-y-5 px-4 py-8 sm:px-6 sm:py-10">
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
            <span className="size-1.5 rounded-[1px] bg-foreground/70" />
            {t("status")}
          </p>

          <div className="max-w-lg space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t("headline")}
            </h1>
            <p className="font-mono text-sm leading-relaxed text-balance text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <Contact />

      <Separator />

      <ContactChannels />

      <Separator />

      <SocialLinks className="border-x-0" title={t("socialTitle")} />

      <div className="border-t border-edge px-4 py-6 sm:px-6">
        <p className="mx-auto max-w-2xl font-mono text-xs leading-relaxed text-muted-foreground">
          {t("privacyNote")}
        </p>
      </div>

      <div className="h-8" />
    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full",
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    />
  )
}
