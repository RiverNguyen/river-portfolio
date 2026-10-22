import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"

import { getAllPosts, getBlogLocale } from "@/features/blog/data/posts"
import { getAllViews } from "@/features/blog/lib/views"
import { getEntryCount } from "@/features/guestbook/lib/store"
import { Visitors } from "@/features/visitors/components/visitors"
import { readVisitorsStore } from "@/features/visitors/lib/store"
import { Link } from "@/i18n/navigation"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Stats")

  return createPageMetadata({
    path: "/stats",
    title: t("title"),
    description: t("description"),
    type: "website",
  })
}

export default async function Page() {
  const t = await getTranslations("Stats")
  const locale = await getLocale()
  const [store, views, guestbookCount] = await Promise.all([
    readVisitorsStore(),
    getAllViews().catch(() => null),
    getEntryCount().catch(() => null),
  ])

  const posts = getAllPosts(getBlogLocale(locale))
  const topPosts = views
    ? posts
        .map((post) => ({ post, views: views[post.slug] ?? 0 }))
        .filter((item) => item.views > 0)
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
    : []
  const maxViews = topPosts[0]?.views ?? 1
  const blogViews = views
    ? Object.values(views).reduce((sum, n) => sum + n, 0)
    : null
  const number = new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US")

  const totals = [
    { label: t("visitors"), value: store.visitors },
    { label: t("pageViews"), value: store.views },
    { label: t("blogViews"), value: blogViews },
    { label: t("guestbookEntries"), value: guestbookCount, href: "/guestbook" },
  ]

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

      <dl className="screen-line-before screen-line-after grid grid-cols-2 sm:grid-cols-4">
        {totals.map((item) => (
          <div
            key={item.label}
            className="border-edge p-4 not-last:border-r max-sm:nth-[-n+2]:border-b max-sm:nth-[2]:border-r-0"
          >
            <dt className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {item.value == null ? "—" : number.format(item.value)}
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-8">
        <h2 className="screen-line-after px-4 text-xl font-semibold">
          {t("topPosts")}
        </h2>
        {topPosts.length === 0 ? (
          <p className="p-4 font-mono text-sm text-muted-foreground">
            {t("noData")}
          </p>
        ) : (
          <ol className="divide-y divide-edge">
            {topPosts.map(({ post, views }) => (
              <li key={post.slug} className="relative px-4 py-3">
                <div
                  aria-hidden
                  className="absolute inset-y-1 left-0 rounded-r-md bg-accent-muted"
                  style={{ width: `${(views / maxViews) * 100}%` }}
                />
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative flex items-baseline justify-between gap-4 text-sm"
                >
                  <span className="truncate font-medium underline-offset-4 hover:underline">
                    {post.metadata.title}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    {t("views", { count: views })}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="mt-8">
        <Visitors />
      </div>
    </div>
  )
}
