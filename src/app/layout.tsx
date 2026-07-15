import "@/styles/globals.css"

import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { getLocale } from "next-intl/server"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import type { WebSite, WithContext } from "schema-dts"

import { DuckFollower } from "@/components/duck-follower"
import { LenisProvider } from "@/components/lenis-provider"
import { PageReveal } from "@/components/page-reveal"
import { Providers } from "@/components/providers"
import { META_THEME_COLORS, SITE_INFO } from "@/config/site"
import { USER } from "@/features/portfolio/data/user"
import { fontMono, fontPixelSquare, fontSans } from "@/lib/fonts"
import { getLanguageAlternates } from "@/lib/seo"
import { cn } from "@/lib/utils"

function getWebSiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_INFO.name,
    url: SITE_INFO.url,
    description: SITE_INFO.description,
    inLanguage: ["en", "vi"],
    alternateName: [USER.username, USER.displayName],
  }
}

// Thanks @shadcn-ui, @tailwindcss
const darkModeScript = String.raw`
  try {
    if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
    }
  } catch (_) {}

  try {
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
      document.documentElement.classList.add('os-macos')
    }
  } catch (_) {}
`

const preloaderBootScript = String.raw`
  try {
    var path = location.pathname;
    var isHome = path === '/' || path === '/vi' || path === '/en';
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isHome && !reduced && localStorage.getItem('portfolio-preloader-seen') !== '1') {
      document.documentElement.setAttribute('data-preloader', '1');
    }
  } catch (_) {}
`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
  alternates: {
    canonical: "/",
    languages: getLanguageAlternates("/"),
  },
  title: {
    template: `%s | ${SITE_INFO.name}`,
    default: `${USER.displayName} | ${USER.jobTitle}`,
  },
  description: SITE_INFO.description,
  keywords: SITE_INFO.keywords,
  authors: [
    {
      name: USER.displayName,
      url: SITE_INFO.url,
    },
  ],
  creator: USER.displayName,
  publisher: USER.displayName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    siteName: SITE_INFO.name,
    url: SITE_INFO.url,
    type: "website",
    locale: "en_US",
    alternateLocale: ["vi_VN"],
    title: `${USER.displayName} | ${USER.jobTitle}`,
    description: SITE_INFO.description,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: `${USER.displayName} — ${USER.jobTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${USER.displayName} | ${USER.jobTitle}`,
    description: SITE_INFO.description,
    images: [SITE_INFO.ogImage],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "/apple-touch-icon.png",
      type: "image/png",
      sizes: "180x180",
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: META_THEME_COLORS.light,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={cn(
        fontSans.variable,
        fontMono.variable,
        fontPixelSquare.variable
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: darkModeScript }}
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: preloaderBootScript }}
        />
        {/*
          Thanks @tailwindcss. We inject the script via the `<Script/>` tag again,
          since we found the regular `<script>` tag to not execute when rendering a not-found page.
         */}
        <Script src={`data:text/javascript;base64,${btoa(darkModeScript)}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebSiteJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
      </head>

      <body>
        <LenisProvider>
          <PageReveal />
          <Providers>
            <NuqsAdapter>
              {children}
              <DuckFollower />
            </NuqsAdapter>
          </Providers>
        </LenisProvider>
      </body>
    </html>
  )
}
