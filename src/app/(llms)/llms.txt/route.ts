import { SITE_INFO } from "@/config/site"
import { getAllPosts } from "@/features/blog/data/posts"
import { USER } from "@/features/portfolio/data/user"

const allPosts = getAllPosts()

const content = `# ${SITE_INFO.url.replace("https://", "")}

> ${SITE_INFO.description}

- [About](${SITE_INFO.url}/about.md): Introduction, tech stack, and contact information.
- [Experience](${SITE_INFO.url}/experience.md): Work history and roles.
- [Projects](${SITE_INFO.url}/projects.md): Selected portfolio projects.
- [Resume](${SITE_INFO.url}/resume): Online CV for ${USER.displayName}.

## Blog

${allPosts.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/blog/${item.slug}.mdx): ${item.metadata.description}`).join("\n")}
`

export const dynamic = "force-static"

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
