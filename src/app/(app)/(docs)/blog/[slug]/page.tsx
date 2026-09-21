import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import type { BlogPosting as PageSchema, WithContext } from "schema-dts"

import { InlineTOC } from "@/components/inline-toc"
import { MDX } from "@/components/mdx"
import { Button } from "@/components/ui/button"
import { Prose } from "@/components/ui/typography"
import { SITE_INFO } from "@/config/site"
import { Link } from "@/i18n/navigation"
import { PostKeyboardShortcuts } from "@/features/blog/components/post-keyboard-shortcuts"
import { PostPaginationButton } from "@/features/blog/components/post-pagination-button"
import { LLMCopyButtonWithViewOptions } from "@/features/blog/components/post-page-actions"
import { PostShareMenu } from "@/features/blog/components/post-share-menu"
import {
  findNeighbour,
  getAllPosts,
  getBlogLocale,
  getPostBySlug,
} from "@/features/blog/data/posts"
import type { Post } from "@/features/blog/types/post"
import { ProfileMascot } from "@/features/portfolio/components/profile-mascot"
import { USER } from "@/features/portfolio/data/user"
import { getAbsoluteUrl, getLanguageAlternates, getLocalizedPath, getLocalizedUrl } from "@/lib/seo"
import { cn } from "@/lib/utils"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const slug = (await params).slug
  const locale = await getLocale()
  const post = getPostBySlug(slug, getBlogLocale(locale))

  if (!post) {
    return notFound()
  }

  const { title, description, image, createdAt, updatedAt } = post.metadata

  const postUrl = getPostUrl(post)
  const ogImage =
    image ||
    `/og/share?kind=blog&title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}`
  const localizedPath = getLocalizedPath(postUrl, locale)

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(postUrl),
    },
    openGraph: {
      url: getLocalizedUrl(postUrl, locale),
      type: "article",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      title,
      description,
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

function getPageJsonLd(
  post: Post,
  locale: string
): WithContext<PageSchema> {
  const postUrl = getPostUrl(post)

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    description: post.metadata.description,
    image: getAbsoluteUrl(
      post.metadata.image ||
        `/og/share?kind=blog&title=${encodeURIComponent(post.metadata.title)}&subtitle=${encodeURIComponent(post.metadata.description)}`
    ),
    url: getAbsoluteUrl(postUrl),
    mainEntityOfPage: getAbsoluteUrl(postUrl),
    datePublished: new Date(post.metadata.createdAt).toISOString(),
    dateModified: new Date(post.metadata.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: USER.displayName,
      url: SITE_INFO.url,
      image: getAbsoluteUrl(USER.avatar),
    },
    publisher: {
      "@type": "Person",
      name: USER.displayName,
    },
    inLanguage: locale === "vi" ? "vi" : "en",
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}) {
  const slug = (await params).slug
  const locale = await getLocale()
  const blogLocale = getBlogLocale(locale)
  const t = await getTranslations("Blog")
  const post = getPostBySlug(slug, blogLocale)

  if (!post) {
    notFound()
  }

  const toc = getTableOfContents(post.content)

  const allPosts = getAllPosts(blogLocale)
  const { previous, next } = findNeighbour(allPosts, slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(post, locale)).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <PostKeyboardShortcuts basePath="/blog" previous={previous} next={next} />

      <div className="flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 rounded-lg px-0 font-mono text-muted-foreground"
          variant="link"
          asChild
        >
          <Link href="/blog">
            <ArrowLeftIcon />
            {t("backToBlog")}
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <LLMCopyButtonWithViewOptions
            markdownUrl={`${getPostUrl(post)}.mdx`}
            isComponent={post.metadata.category === "components"}
          />

          <PostShareMenu title={post.metadata.title} url={getPostUrl(post)} />

          {previous && (
            <PostPaginationButton
              href={`/blog/${previous.slug}`}
              direction="previous"
              label={t("previousPost")}
            />
          )}

          {next && (
            <PostPaginationButton
              href={`/blog/${next.slug}`}
              direction="next"
              label={t("nextPost")}
            />
          )}
        </div>
      </div>

      <div className="screen-line-before screen-line-after">
        <div
          className={cn(
            "h-8",
            "before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
            "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56"
          )}
        />
      </div>

      <Prose className="px-4">
        <h1 className="screen-line-after text-3xl font-semibold">
          {post.metadata.title}
        </h1>

        <p className="text-muted-foreground">{post.metadata.description}</p>

        <div className="not-prose my-4 flex gap-3 border-y border-edge py-3">
          <div className="size-10 shrink-0 overflow-hidden rounded-full border border-edge/60 bg-background p-0.5 ring-1 ring-border ring-offset-1 ring-offset-background">
            <ProfileMascot size={36} label={USER.displayName} />
          </div>
          <div className="min-w-0 font-mono text-xs leading-relaxed text-muted-foreground">
            <p className="text-sm text-foreground">{USER.displayName}</p>
            <p>
              <time dateTime={post.metadata.createdAt}>
                {t("published")} {formatPostDate(post.metadata.createdAt, locale)}
              </time>
              {" · "}
              <time dateTime={post.metadata.updatedAt}>
                {t("updated")} {formatPostDate(post.metadata.updatedAt, locale)}
              </time>
              {" · "}
              {t("minRead", { minutes: readingMinutes(post.content) })}
            </p>
            <p className="mt-1 max-w-prose">{t("authorBio")}</p>
          </div>
        </div>

        <InlineTOC items={toc} />

        <div>
          <MDX code={post.content} />
        </div>
      </Prose>

      <div className="screen-line-before h-4 w-full" />
    </>
  )
}

function getPostUrl(post: Post) {
  const isComponent = post.metadata.category === "components"
  return isComponent ? `/components/${post.slug}` : `/blog/${post.slug}`
}

function readingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

function formatPostDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}
