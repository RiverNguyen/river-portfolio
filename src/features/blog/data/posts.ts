import fs from "fs"
import matter from "gray-matter"
import path from "path"
import { cache } from "react"

import type { Post, PostMetadata } from "@/features/blog/types/post"

export type BlogLocale = "en" | "vi"

const CONTENT_DIR = path.join(process.cwd(), "src/features/blog/content")

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent)

  return {
    metadata: file.data as PostMetadata,
    content: file.content,
  }
}

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8")
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)

  return mdxFiles.map<Post>((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))

    const slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

function sortPosts(posts: Post[]) {
  return posts.sort((a, b) => {
    if (a.metadata.pinned && !b.metadata.pinned) return -1
    if (!a.metadata.pinned && b.metadata.pinned) return 1

    return (
      new Date(b.metadata.createdAt).getTime() -
      new Date(a.metadata.createdAt).getTime()
    )
  })
}

function mergeLocalizedPosts(enPosts: Post[], viPosts: Post[]) {
  return enPosts.map((enPost) => {
    const viPost = viPosts.find((post) => post.slug === enPost.slug)
    return viPost ?? enPost
  })
}

export const getAllPosts = cache((locale: BlogLocale = "en") => {
  const enPosts = sortPosts(getMDXData(CONTENT_DIR))

  if (locale === "en") {
    return enPosts
  }

  const viPosts = getMDXData(path.join(CONTENT_DIR, "vi"))
  return sortPosts(mergeLocalizedPosts(enPosts, viPosts))
})

export function getPostBySlug(slug: string, locale: BlogLocale = "en") {
  return getAllPosts(locale).find((post) => post.slug === slug)
}

export function getPostsByCategory(category: string, locale: BlogLocale = "en") {
  return getAllPosts(locale).filter((post) => post.metadata?.category === category)
}

export function findNeighbour(posts: Post[], slug: string) {
  const len = posts.length

  for (let i = 0; i < len; ++i) {
    if (posts[i].slug === slug) {
      return {
        previous: i > 0 ? posts[i - 1] : null,
        next: i < len - 1 ? posts[i + 1] : null,
      }
    }
  }

  return { previous: null, next: null }
}

export function getBlogLocale(locale: string): BlogLocale {
  return locale === "vi" ? "vi" : "en"
}
