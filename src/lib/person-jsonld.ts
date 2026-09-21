import type { Person, WithContext } from "schema-dts"

import { SITE_INFO } from "@/config/site"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import {
  getUserByLocale,
  type PortfolioLocale,
  USER,
} from "@/features/portfolio/data/user"
import { TECH_STACK } from "@/features/portfolio/data/tech-stack"
import { getAbsoluteUrl, getLocalizedUrl } from "@/lib/seo"
import { decodeEmail, decodePhoneNumber } from "@/utils/string"

export function getPersonJsonLd(
  locale: PortfolioLocale,
  opts?: { pagePath?: string }
): WithContext<Person> {
  const user = getUserByLocale(locale)
  const pageUrl = opts?.pagePath
    ? getLocalizedUrl(opts.pagePath, locale)
    : SITE_INFO.url

  return {
    "@context": "https://schema.org",
    "@type": "Person",
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
    url: pageUrl,
    image: getAbsoluteUrl(USER.avatar),
    jobTitle: user.jobTitle,
    description:
      locale === "vi"
        ? `${USER.displayName} (River) — ${user.jobTitle} tại Hà Nội. Portfolio, dự án, blog và liên hệ.`
        : SITE_INFO.description,
    email: decodeEmail(USER.email),
    telephone: decodePhoneNumber(USER.phoneNumber),
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
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  }
}
