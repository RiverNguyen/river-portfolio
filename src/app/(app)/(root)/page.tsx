import type { ProfilePage as PageSchema, WithContext } from "schema-dts"

import { SITE_INFO } from "@/config/site"
import { About } from "@/features/portfolio/components/about"
import { Blog } from "@/features/portfolio/components/blog"
import { Contact } from "@/features/portfolio/components/contact"
import { Experiences } from "@/features/portfolio/components/experiences"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import { Overview } from "@/features/portfolio/components/overview"
import { ProfileCover } from "@/features/portfolio/components/profile-cover"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { Projects } from "@/features/portfolio/components/projects"
import { SocialLinks } from "@/features/portfolio/components/social-links"
import { TechStack } from "@/features/portfolio/components/tech-stack"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"
import { getAbsoluteUrl } from "@/lib/seo"
import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd()).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto md:max-w-3xl *:[[id]]:scroll-mt-22">
        <ProfileCover />
        <ProfileHeader />
        <Separator />

        <Overview />
        <Separator />

        <SocialLinks />
        <Separator />

        <About />
        <div className="flex h-4 w-full border-x border-edge" />

        {/* <TestimonialsMarquee /> */}
        <div className="flex h-4 w-full border-x border-edge" />

        <GitHubContributions />
        <Separator />

        <TechStack />
        <Separator />

        {/* <Components />
        <Separator /> */}

        <Experiences />
        <Separator />

        <Projects />
        <Separator />

        <Blog />
        <Separator />

        <Contact />
        <Separator />

        {/* <Awards />
        <Separator />

        <Certifications />
        <Separator />

        <Bookmarks />
        <Separator /> */}

        {/* <Sponsors />
        <Separator /> */}
      </div>
    </>
  )
}

function getPageJsonLd(): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${USER.displayName} | Nguyễn Đình Giang | ${USER.jobTitle}`,
    url: SITE_INFO.url,
    dateCreated: new Date(USER.dateCreated).toISOString(),
    dateModified: new Date().toISOString(),
    inLanguage: ["en", "vi"],
    mainEntity: {
      "@type": "Person",
      name: USER.displayName,
      givenName: USER.firstName,
      additionalName: "Đình",
      familyName: USER.lastName,
      alternateName: [
        "Nguyễn Đình Giang",
        "Giang Nguyen Dinh",
        "Nguyen Dinh Giang",
        USER.username,
        "River Nguyen",
      ],
      url: SITE_INFO.url,
      image: getAbsoluteUrl(USER.avatar),
      jobTitle: USER.jobTitle,
      description: SITE_INFO.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: USER.address,
        addressCountry: "VN",
      },
      sameAs: SOCIAL_LINKS.map((link) => link.href),
    },
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
