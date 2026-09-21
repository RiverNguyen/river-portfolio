import type { Metadata } from "next"
import { getLocale } from "next-intl/server"

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

export async function createPageMetadata({
  path,
  title,
  description,
  image,
  type = "website",
  locale: localeProp,
}: {
  path: string
  title: string
  description: string
  image?: string
  type?: "website" | "article" | "profile"
  locale?: string
}): Promise<Metadata> {
  const locale = localeProp ?? (await getLocale())
  const localizedPath = getLocalizedPath(path, locale)
  const ogImage = image || SITE_INFO.ogImage

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: getLocalizedUrl(path, locale),
      type,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      alternateLocale: locale === "vi" ? ["en_US"] : ["vi_VN"],
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
