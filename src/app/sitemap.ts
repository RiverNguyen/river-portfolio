import type { MetadataRoute } from "next"

import { getAllPosts } from "@/features/blog/data/posts"
import { getAllCaseStudySlugs } from "@/features/portfolio/data/case-studies"
import { routing } from "@/i18n/routing"
import { getLanguageAlternates, getLocalizedUrl } from "@/lib/seo"

const STATIC_ROUTES = [
  "",
  "/projects",
  "/resume",
  "/blog",
  "/contact",
  "/hire",
] as const

function localizedEntries(
  path: string,
  lastModified?: Date
): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: getLocalizedUrl(path, locale),
    ...(lastModified ? { lastModified } : {}),
    alternates: {
      languages: getLanguageAlternates(path),
    },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().flatMap((post) =>
    localizedEntries(
      `/blog/${post.slug}`,
      new Date(post.metadata.updatedAt)
    )
  )

  const caseStudies = getAllCaseStudySlugs().flatMap((slug) =>
    localizedEntries(`/projects/${slug}`)
  )

  const routes = STATIC_ROUTES.flatMap((route) => localizedEntries(route))

  return [...routes, ...caseStudies, ...posts]
}
