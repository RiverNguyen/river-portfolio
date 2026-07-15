import { GITHUB_USERNAME } from "@/config/site"
import {
  getExperiencesByLocale,
  type PortfolioLocale,
} from "@/features/portfolio/data/experiences"
import {
  getProjectsByLocale,
} from "@/features/portfolio/data/projects"
import { getUserByLocale } from "@/features/portfolio/data/user"
import type { Experience } from "@/features/portfolio/types/experiences"
import type { Project } from "@/features/portfolio/types/projects"
import type {
  Resume,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkillGroup,
} from "@/features/resume/types/resume"
import { decodeEmail, decodePhoneNumber } from "@/utils/string"

function stripMarkdown(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
}

function isRoleHeaderBullet(line: string): boolean {
  return line.includes(" at ") && /\([\d./\w\s-]+\)\s*$/.test(line)
}

function parseMarkdownBullets(description?: string): string[] {
  if (!description) return []

  return description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => stripMarkdown(line.replace(/^-\s*/, "")))
    .filter((line) => !isRoleHeaderBullet(line))
    .filter(Boolean)
}

function parseMarkdownSummary(description?: string): string {
  if (!description) return ""

  const summaryParts: string[] = []

  for (const line of description.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith("- ")) break
    summaryParts.push(stripMarkdown(trimmed))
  }

  return summaryParts.join(" ")
}

function markdownToParagraph(markdown: string): string {
  return markdown
    .split("\n")
    .map((line) => stripMarkdown(line.replace(/^-\s*/, "")))
    .filter(Boolean)
    .join(" ")
}

function formatPeriod(start: string, end?: string): string {
  return `${start} — ${end ?? "Present"}`
}

function mapExperience(exp: Experience): ResumeExperience[] {
  return exp.positions.map((position) => ({
    company: exp.companyName,
    companyUrl: exp.companyWebsite,
    period: formatPeriod(
      position.employmentPeriod.start,
      position.employmentPeriod.end
    ),
    title: position.title,
    highlights: parseMarkdownBullets(position.description),
  }))
}

function mapProject(project: Project): ResumeProject {
  const bullets = parseMarkdownBullets(project.description)
  const summary = parseMarkdownSummary(project.description)

  return {
    name: project.title,
    url: project.link,
    period: formatPeriod(project.period.start, project.period.end),
    role: "Web Developer",
    description: summary,
    technologies: project.skills.join(", "),
    responsibilities: bullets,
  }
}

function mapEducation(exp: Experience, locale: PortfolioLocale): ResumeEducation[] {
  return exp.positions.map((position) => ({
    school: exp.companyName,
    period: formatPeriod(
      position.employmentPeriod.start,
      position.employmentPeriod.end
    ),
    degree: position.title,
    highlights: parseMarkdownBullets(position.description),
  }))
}

function buildSkills(
  experiences: Experience[],
  projects: Project[],
  locale: PortfolioLocale
): ResumeSkillGroup[] {
  const skills = [
    ...new Set([
      ...experiences.flatMap((exp) =>
        exp.positions.flatMap((position) => position.skills ?? [])
      ),
      ...projects.flatMap((project) => project.skills),
    ]),
  ]

  return [
    {
      label: locale === "vi" ? "Công nghệ" : "Technologies",
      value: skills.join(", "),
    },
    {
      label: locale === "vi" ? "Công cụ" : "Tools",
      value: "Docker, Postman, cPanel, Termius, Figma, GitHub, GitLab",
    },
    {
      label: locale === "vi" ? "Ngoại ngữ" : "Languages",
      value:
        locale === "vi"
          ? "Tiếng Anh: đọc hiểu tài liệu kỹ thuật, giao tiếp cơ bản"
          : "English: reading and understanding technical documents, basic communication",
    },
  ]
}

export function buildResume(locale: PortfolioLocale): Resume {
  const user = getUserByLocale(locale)
  const experiences = getExperiencesByLocale(locale)
  const projects = getProjectsByLocale(locale)

  const workExperiences = experiences.filter(
    (exp) => !exp.id.startsWith("education")
  )
  const educationExperiences = experiences.filter((exp) =>
    exp.id.startsWith("education")
  )

  return {
    name: user.displayName,
    title: user.jobTitle,
    contact: {
      phone: decodePhoneNumber(user.phoneNumber),
      email: decodeEmail(user.email),
      github: `github.com/${GITHUB_USERNAME}`,
      githubUrl: `https://github.com/${GITHUB_USERNAME}`,
      location: user.address,
    },
    objective: markdownToParagraph(user.about),
    experience: workExperiences.flatMap(mapExperience),
    skills: buildSkills(workExperiences, projects, locale),
    projects: projects.map(mapProject),
    education: educationExperiences.flatMap((experience) =>
      mapEducation(experience, locale)
    ),
  }
}

export function getResumeByLocale(locale: PortfolioLocale): Resume {
  return buildResume(locale)
}
