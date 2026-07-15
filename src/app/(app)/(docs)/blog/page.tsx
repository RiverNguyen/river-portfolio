import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { Suspense } from "react"

import { PostList } from "@/features/blog/components/post-list"
import { PostListWithSearch } from "@/features/blog/components/post-list-with-search"
import { PostSearchInput } from "@/features/blog/components/post-search-input"
import { getAllPosts, getBlogLocale } from "@/features/blog/data/posts"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Blog")

  return createPageMetadata({
    path: "/blog",
    title: t("title"),
    description: t("description"),
    type: "website",
  })
}

export default async function Page() {
  const locale = await getLocale()
  const t = await getTranslations("Blog")
  const allPosts = getAllPosts(getBlogLocale(locale))

  return (
    <div className="min-h-svh">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="screen-line-before screen-line-after p-2">
        <Suspense
          fallback={
            <div className="flex h-9 w-full rounded-lg border border-input shadow-xs dark:bg-input/30" />
          }
        >
          <PostSearchInput />
        </Suspense>
      </div>

      <Suspense fallback={<PostList posts={allPosts} />}>
        <PostListWithSearch posts={allPosts} />
      </Suspense>

      <div className="h-4" />
    </div>
  )
}
