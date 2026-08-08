import type { MetadataRoute } from "next"

import { getAllPosts } from "@/features/blog/data/posts"
import { getAllCaseStudySlugs } from "@/features/portfolio/data/case-studies"
import { getLanguageAlternates, getLocalizedUrl } from "@/lib/seo"

const STATIC_ROUTES = ["", "/projects", "/resume", "/blog", "/contact"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: getLocalizedUrl(`/blog/${post.slug}`, "en"),
    lastModified: new Date(post.metadata.updatedAt),
    alternates: {
      languages: getLanguageAlternates(`/blog/${post.slug}`),
    },
  }))

  const caseStudies = getAllCaseStudySlugs().map((slug) => ({
    url: getLocalizedUrl(`/projects/${slug}`, "en"),
    lastModified: new Date(),
    alternates: {
      languages: getLanguageAlternates(`/projects/${slug}`),
    },
  }))

  const routes = STATIC_ROUTES.map((route) => ({
    url: getLocalizedUrl(route, "en"),
    lastModified: new Date(),
    alternates: {
      languages: getLanguageAlternates(route),
    },
  }))

  return [...routes, ...caseStudies, ...posts]
}
