import dynamic from "next/dynamic"
import { getLocale, getTranslations } from "next-intl/server"

import { DesktopNav } from "@/components/desktop-nav"
import { getAllPosts } from "@/features/blog/data/posts"
import type { PostPreview } from "@/features/blog/types/post"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { LanguageSwitcher } from "./language-switcher"
import { SiteHeaderMark } from "./site-header-mark"
import { ThemeToggle } from "./theme-toggle"

const MobileNav = dynamic(() =>
  import("@/components/mobile-nav").then((mod) => mod.MobileNav)
)

const CommandMenu = dynamic(() =>
  import("@/components/command-menu").then((mod) => mod.CommandMenu)
)

export async function SiteHeader() {
  const locale = await getLocale()
  const portfolioLocale = locale === "vi" ? "vi" : "en"
  const t = await getTranslations("Nav")
  const posts = getAllPosts(portfolioLocale)
  const postPreviews: PostPreview[] = posts.map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    category: post.metadata.category,
    icon: post.metadata.icon,
  }))

  const navItems = [
    { title: t("portfolio"), href: "/" },
    { title: t("projects"), href: "/projects" },
    { title: t("resume"), href: "/resume" },
    { title: t("blog"), href: "/blog" },
    { title: t("contact"), href: "/contact" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2"
      )}
    >
      <div
        className="screen-line-before screen-line-after mx-auto flex h-12 items-center justify-between gap-2 border-x border-edge px-2 after:z-1 after:transition-[background-color] sm:gap-4 md:max-w-3xl"
        data-header-container
      >
        <Link
          className="shrink-0 transition-[scale] ease-out active:scale-[0.98] has-data-[visible=false]:pointer-events-none [&_svg]:h-8"
          href="/"
          aria-label="Home"
        >
          <SiteHeaderMark />
        </Link>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <DesktopNav items={navItems} />
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <CommandMenu posts={postPreviews} />
            <ThemeToggle />
            <LanguageSwitcher />
            <MobileNav items={navItems} />
          </div>
        </div>
      </div>
    </header>
  )
}
