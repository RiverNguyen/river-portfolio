import dynamic from "next/dynamic"
import { getTranslations } from "next-intl/server"

import { DesktopNav } from "@/components/desktop-nav"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import { LanguageSwitcher } from "./language-switcher"
import { SiteHeaderMark } from "./site-header-mark"
import { ThemeToggle } from "./theme-toggle"

const BrandContextMenu = dynamic(() =>
  import("@/components/brand-context-menu").then((mod) => mod.BrandContextMenu)
)

const MobileNav = dynamic(() =>
  import("@/components/mobile-nav").then((mod) => mod.MobileNav)
)

export async function SiteHeader() {
  const t = await getTranslations("Nav")
  // const posts = getAllPosts()
  // const postPreviews: PostPreview[] = posts.map((post) => ({
  //   slug: post.slug,
  //   title: post.metadata.title,
  //   category: post.metadata.category,
  //   icon: post.metadata.icon,
  // }))

  const navItems = [
    { title: t("portfolio"), href: "/" },
    { title: t("blog"), href: "/blog" },
    { title: t("contact"), href: "/#contact" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2"
        // "data-[affix=true]:shadow-[0_0_16px_0_black]/8 dark:data-[affix=true]:shadow-[0_0_16px_0_black]",
        // "not-dark:data-[affix=true]:**:data-header-container:after:bg-border",
        // "transition-shadow duration-300"
      )}
    >
      <div
        className="screen-line-before screen-line-after mx-auto flex h-12 items-center justify-between gap-2 border-x border-edge px-2 after:z-1 after:transition-[background-color] sm:gap-4 md:max-w-3xl"
        data-header-container
      >
        <BrandContextMenu>
          <Link
            className="transition-[scale] ease-out active:scale-[0.98] has-data-[visible=false]:pointer-events-none [&_svg]:h-8"
            href="/"
            aria-label="Home"
          >
            <SiteHeaderMark />
          </Link>
        </BrandContextMenu>

        <div className="flex-1" />

        <DesktopNav items={navItems} />

        <div className="flex items-center *:first:mr-2">
          {/* <CommandMenu posts={postPreviews} /> */}
          {/* <NavItemGitHub /> */}
          {/* <span className="mx-2 flex h-4 w-px bg-border" /> */}
          <ThemeToggle />
          <LanguageSwitcher />
          <MobileNav items={navItems} />
        </div>
      </div>
    </header>
  )
}
