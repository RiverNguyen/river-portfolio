import type { Metadata } from "next"

import { SITE_INFO } from "@/config/site"
import { routing } from "@/i18n/routing"

function normalizePath(path: string) {
  if (!path || path === "/") return "/"
  return path.startsWith("/") ? path : `/${path}`
}

export function getLocalizedPath(path: string, locale: string) {
  const normalizedPath = normalizePath(path)

  if (locale === routing.defaultLocale) {
    return normalizedPath
  }

  return normalizedPath === "/"
    ? `/${locale}`
    : `/${locale}${normalizedPath}`
}

export function getAbsoluteUrl(path: string) {
  return `${SITE_INFO.url}${normalizePath(path)}`
}

export function getLocalizedUrl(path: string, locale: string) {
  return `${SITE_INFO.url}${getLocalizedPath(path, locale)}`
}

export function getLanguageAlternates(path: string) {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      getLocalizedUrl(path, locale),
    ])
  )

  return {
    ...languages,
    "x-default": getLocalizedUrl(path, routing.defaultLocale),
  }
}

export function createPageMetadata({
  path,
  title,
  description,
  image,
  type = "website",
}: {
  path: string
  title: string
  description: string
  image?: string
  type?: "website" | "article" | "profile"
}): Metadata {
  const ogImage = image || SITE_INFO.ogImage

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: getLocalizedUrl(path, routing.defaultLocale),
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}
