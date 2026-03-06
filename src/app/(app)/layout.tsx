import dynamic from "next/dynamic"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"

import { ScrollToHash } from "@/components/scroll-to-hash"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { routing } from "@/i18n/routing"

const ScrollToTop = dynamic(() =>
  import("@/components/scroll-to-top").then((mod) => mod.ScrollToTop)
)

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Unprefixed routes (e.g. `/blog`) are treated as the default locale.
  // Enable static rendering for next-intl usage in this subtree.
  setRequestLocale(routing.defaultLocale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <ScrollToHash />
      <SiteHeader />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter />
      <ScrollToTop />
    </NextIntlClientProvider>
  )
}
