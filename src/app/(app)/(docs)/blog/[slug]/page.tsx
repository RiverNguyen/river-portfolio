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
import { USER } from "@/features/portfolio/data/user"
import { getAbsoluteUrl, getLanguageAlternates, getLocalizedUrl } from "@/lib/seo"
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
  const ogImage = image || `/og/simple?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
      languages: getLanguageAlternates(postUrl),
    },
    openGraph: {
      url: getLocalizedUrl(postUrl, "en"),
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

function getPageJsonLd(post: Post): WithContext<PageSchema> {
  const postUrl = getPostUrl(post)

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    description: post.metadata.description,
    image:
      post.metadata.image ||
      getAbsoluteUrl(
        `/og/simple?title=${encodeURIComponent(post.metadata.title)}`
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
    inLanguage: ["en", "vi"],
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
          __html: JSON.stringify(getPageJsonLd(post)).replace(/</g, "\\u003c"),
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
