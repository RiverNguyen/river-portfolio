import type { Person, WithContext } from "schema-dts"

import { SITE_INFO } from "@/config/site"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { TECH_STACK } from "@/features/portfolio/data/tech-stack"
import {
  getUserByLocale,
  type PortfolioLocale,
  USER,
} from "@/features/portfolio/data/user"
import { getAbsoluteUrl } from "@/lib/seo"

/** Stable Person node every page should reference. */
export const PERSON_ID = `${SITE_INFO.url}/#person`

export function getPersonJsonLd(locale: PortfolioLocale): WithContext<Person> {
  const user = getUserByLocale(locale)

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: USER.displayName,
    givenName: USER.firstName,
    additionalName: "Đình",
    familyName: USER.lastName,
    alternateName: [
      "Giang Nguyễn Đình",
      "Nguyen Dinh Giang",
      "Giang Nguyen Dinh",
      USER.username,
      "River Nguyen",
    ],
    url: SITE_INFO.url,
    image: getAbsoluteUrl(USER.avatar),
    jobTitle: user.jobTitle,
    description:
      locale === "vi"
        ? `${USER.displayName} (River) — ${user.jobTitle} tại Hà Nội. Portfolio, dự án, blog và liên hệ.`
        : SITE_INFO.description,
    knowsLanguage: ["vi", "en"],
    knowsAbout: TECH_STACK.map((tech) => tech.title),
    address: {
      "@type": "PostalAddress",
      addressLocality: user.address,
      addressCountry: "VN",
    },
    worksFor: {
      "@type": "Organization",
      name: user.jobs[0]?.company ?? "Bateco Group",
      url: user.jobs[0]?.website,
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "FPT Polytechnic",
        url: "https://caodang.fpt.edu.vn",
      },
      {
        "@type": "CollegeOrUniversity",
        name:
          locale === "vi"
            ? "Đại học Giao thông Vận tải"
            : "University of Transport and Communications",
        url: "https://www.utc.edu.vn",
      },
    ],
    // Public profiles only — skip Zalo (carries a phone number in the URL).
    sameAs: [
      ...SOCIAL_LINKS.filter((link) => link.title !== "Zalo").map(
        (link) => link.href
      ),
      "https://www.youtube.com/@Jang-1309",
    ],
  }
}
