import { ArrowRightIcon } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { PostItem } from "@/features/blog/components/post-item"
import { getAllPosts, getBlogLocale } from "@/features/blog/data/posts"
import { Link } from "@/i18n/navigation"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"

export async function Blog() {
  const locale = await getLocale()
  const t = await getTranslations("Blog")
  const allPosts = getAllPosts(getBlogLocale(locale))

  return (
    <Panel id="blog">
      <PanelHeader>
        <PanelTitle>
          {t("title")}
          <PanelTitleSup>({allPosts.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <div className="relative py-4">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge"></div>
          <div className="border-l border-edge"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allPosts.slice(0, 4).map((post) => (
            <PostItem key={post.slug} post={post} />
          ))}
        </div>
      </div>

      <div className="screen-line-before flex justify-center py-2">
        <Button className="px-3" variant="default" asChild>
          <Link href="/blog">
            {t("allPosts")}
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </Panel>
  )
}
