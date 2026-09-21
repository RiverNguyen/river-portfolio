import { getLocale } from "next-intl/server"
import { Suspense } from "react"
import type { ProfilePage as PageSchema, WithContext } from "schema-dts"

import { About } from "@/features/portfolio/components/about"
import { Blog } from "@/features/portfolio/components/blog"
import { ContactCta } from "@/features/portfolio/components/contact-cta"
import { Education } from "@/features/portfolio/components/education"
import { Experiences } from "@/features/portfolio/components/experiences"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import { HireModeRedirect } from "@/features/portfolio/components/hire-mode-redirect"
import { Now } from "@/features/portfolio/components/now"
import { Overview } from "@/features/portfolio/components/overview"
import { ProfileCover } from "@/features/portfolio/components/profile-cover"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { Projects } from "@/features/portfolio/components/projects"
import { SocialLinks } from "@/features/portfolio/components/social-links"
import { TechStack } from "@/features/portfolio/components/tech-stack"
import { getUserByLocale } from "@/features/portfolio/data/user"
import { Visitors } from "@/features/visitors/components/visitors"
import { getPersonJsonLd } from "@/lib/person-jsonld"
import { getLocalizedUrl } from "@/lib/seo"
import { cn } from "@/lib/utils"

export default async function Page() {
  const locale = await getLocale()
  const portfolioLocale = locale === "vi" ? "vi" : "en"

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(portfolioLocale)).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <Suspense fallback={null}>
        <HireModeRedirect />
      </Suspense>

      <div className="mx-auto md:max-w-3xl *:[[id]]:scroll-mt-22">
        <ProfileCover />
        <ProfileHeader />
        <Separator />

        <Overview />
        <Separator />

        <SocialLinks />
        <Separator />

        <About />
        <Separator />

        <Now />
        <Separator />

        <GitHubContributions />
        <Separator />

        <TechStack />
        <Separator />

        <Experiences />
        <Separator />

        <Projects />
        <Separator />

        <Education />
        <Separator />

        <Blog />
        <Separator />

        <ContactCta />
        <Separator />

        <Visitors />
        <Separator />
      </div>
    </>
  )
}

function getPageJsonLd(locale: "en" | "vi"): WithContext<PageSchema> {
  const user = getUserByLocale(locale)

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${user.displayName} | ${user.jobTitle}`,
    url: getLocalizedUrl("/", locale),
    dateCreated: new Date(user.dateCreated).toISOString(),
    dateModified: new Date().toISOString(),
    inLanguage: locale,
    mainEntity: getPersonJsonLd(locale),
  }
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-edge",
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    />
  )
}
