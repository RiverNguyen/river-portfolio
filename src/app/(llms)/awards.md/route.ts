import { AWARDS } from "@/features/portfolio/data/awards"

const content = `# Awards

${AWARDS.map((item) => `## ${item.prize} | ${item.title}\n\n${item.description}`).join("\n\n")}
`

export const dynamic = "force-static"

export async function GET() {
  if (AWARDS.length === 0) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
