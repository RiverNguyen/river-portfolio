import type { MetadataRoute } from "next"

import { SITE_INFO } from "@/config/site"
import { getAllPosts } from "@/features/blog/data/posts"
import { getLanguageAlternates, getLocalizedUrl } from "@/lib/seo"

const STATIC_ROUTES = ["", "/projects", "/resume", "/blog"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: getLocalizedUrl(`/blog/${post.slug}`, "en"),
    lastModified: new Date(post.metadata.updatedAt),
    alternates: {
      languages: getLanguageAlternates(`/blog/${post.slug}`),
    },
  }))

  const routes = STATIC_ROUTES.map((route) => ({
    url: getLocalizedUrl(route, "en"),
    lastModified: new Date(),
    alternates: {
      languages: getLanguageAlternates(route),
    },
  }))

  return [...routes, ...posts]
}
