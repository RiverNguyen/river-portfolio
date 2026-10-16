import { format } from "date-fns"

import { SITE_INFO } from "@/config/site"
import { getAllPosts } from "@/features/blog/data/posts"
import { getLLMText } from "@/features/blog/lib/get-llm-text"
import { USER } from "@/features/portfolio/data/user"
import {
  aboutText,
  awardsText,
  certificationsText,
  experienceText,
  projectsText,
} from "@/lib/llms-profile"

const allPosts = getAllPosts()

async function getBlogContent() {
  const text = await Promise.all(
    allPosts.map(
      async (item) =>
        `---\ntitle: "${item.metadata.title}"\ndescription: "${item.metadata.description}"\nlast_updated: "${format(new Date(item.metadata.updatedAt), "MMMM d, yyyy")}"\nsource: "${SITE_INFO.url}/blog/${item.slug}"\n---\n\n${await getLLMText(item)}`
    )
  )
  return text.join("\n\n")
}

async function getContent() {
  return `<SYSTEM>This document contains comprehensive information about ${USER.displayName}'s professional profile, portfolio, and blog content. It includes personal details, work experience, projects, achievements, certifications, and all published blog posts. This data is formatted for consumption by Large Language Models (LLMs) to provide accurate and up-to-date information about ${USER.displayName}'s background, skills, and expertise as a Frontend Developer.</SYSTEM>

# ${SITE_INFO.url.replace("https://", "")}

> ${SITE_INFO.description}

${aboutText}
${experienceText}
${projectsText}
${awardsText}
${certificationsText}

## Blog

${await getBlogContent()}`
}

export const dynamic = "force-static"

export async function GET() {
  return new Response(await getContent(), {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
