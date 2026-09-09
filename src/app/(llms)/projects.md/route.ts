import { PROJECTS } from "@/features/portfolio/data/projects"

const content = `# Projects

${PROJECTS.map((item) => {
  const skills = `\n\nSkills: ${item.skills.join(", ")}`
  const description = item.description ? `\n\n${item.description.trim()}` : ""
  const url = item.link ? `\n\nProject URL: ${item.link}` : ""
  return `## ${item.title}${url}${skills}${description}`
}).join("\n\n")}
`

export const dynamic = "force-static"

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
