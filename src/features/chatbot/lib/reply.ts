import {
  getEducationByLocale,
  getWorkExperiencesByLocale,
} from "@/features/portfolio/data/experiences"
import { NOW_EN, NOW_VI } from "@/features/portfolio/data/now"
import { PROJECTS_EN, PROJECTS_VI } from "@/features/portfolio/data/projects"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { TECH_STACK } from "@/features/portfolio/data/tech-stack"
import { USER_EN, USER_VI } from "@/features/portfolio/data/user"

type Locale = "en" | "vi"
type Intent =
  | "greeting"
  | "about"
  | "projects"
  | "stack"
  | "experience"
  | "education"
  | "hire"
  | "contact"
  | "resume"
  | "blog"
  | "now"
  | "social"
  | "fallback"

type IntentRule = {
  intent: Intent
  weight: number
  patterns: RegExp[]
}

/** Unicode-safe "word" match — JS `\b` breaks on Vietnamese letters like ê/ư. */
function phrase(...alts: string[]) {
  const body = alts.map(escapeRegExp).join("|")
  return new RegExp(`(?<![\\p{L}\\p{N}_])(?:${body})(?![\\p{L}\\p{N}_])`, "iu")
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: "greeting",
    weight: 2,
    patterns: [
      /^(hi|hello|hey|yo|sup|chào|xin chào)\b/iu,
      phrase("who are you", "what is this", "bạn là ai", "em là ai", "bot gì"),
    ],
  },
  {
    intent: "about",
    weight: 3,
    patterns: [
      phrase(
        "about",
        "who is",
        "bio",
        "background",
        "introduce",
        "introduction",
        "giới thiệu",
        "tiểu sử",
        "về river",
        "về giang",
        "river là ai",
        "giang là ai"
      ),
      phrase("where based", "location", "hanoi", "hà nội", "ở đâu", "sống ở"),
    ],
  },
  {
    intent: "projects",
    weight: 4,
    patterns: [
      phrase(
        "project",
        "projects",
        "case study",
        "case studies",
        "portfolio work",
        "shipped",
        "dự án",
        "đã làm",
        "sản phẩm",
        "tour",
        "booking",
        "landing",
        "wordpress",
        "nda"
      ),
    ],
  },
  {
    intent: "stack",
    weight: 4,
    patterns: [
      phrase(
        "stack",
        "tech",
        "technology",
        "technologies",
        "tools",
        "tool",
        "framework",
        "next.js",
        "nextjs",
        "react",
        "typescript",
        "công nghệ",
        "stack gì",
        "dùng gì",
        "thư viện"
      ),
    ],
  },
  {
    intent: "experience",
    weight: 4,
    patterns: [
      phrase(
        "experience",
        "experiences",
        "work history",
        "career",
        "employer",
        "job",
        "role",
        "years",
        "kinh nghiệm",
        "làm việc",
        "công ty",
        "vị trí",
        "năm kinh nghiệm",
        "bateco",
        "okhub"
      ),
    ],
  },
  {
    intent: "education",
    weight: 4,
    patterns: [
      phrase(
        "education",
        "school",
        "university",
        "degree",
        "studied",
        "học vấn",
        "học ở đâu",
        "trường",
        "đại học",
        "cao đẳng",
        "fpt",
        "utc",
        "polytechnic"
      ),
    ],
  },
  {
    intent: "hire",
    weight: 6,
    patterns: [
      phrase(
        "hire",
        "hiring",
        "available",
        "availability",
        "freelance",
        "contract",
        "rate",
        "budget",
        "work with",
        "thuê",
        "thuê river",
        "tuyển",
        "tuyển dụng",
        "nhận việc",
        "hợp tác",
        "có rảnh",
        "nhận project",
        "nhận dự án",
        "open to work",
        "làm sao để thuê",
        "how can i hire",
        "how to hire"
      ),
    ],
  },
  {
    intent: "contact",
    weight: 5,
    patterns: [
      phrase(
        "contact",
        "email",
        "phone",
        "reach",
        "message",
        "zalo",
        "get in touch",
        "liên hệ",
        "sđt",
        "số điện thoại",
        "nhắn",
        "nhắn tin"
      ),
    ],
  },
  {
    intent: "resume",
    weight: 4,
    patterns: [phrase("resume", "cv", "curriculum", "hồ sơ")],
  },
  {
    intent: "blog",
    weight: 3,
    patterns: [
      phrase("blog", "article", "articles", "writing", "posts", "post", "bài viết", "viết gì"),
    ],
  },
  {
    intent: "now",
    weight: 3,
    patterns: [
      phrase(
        "now",
        "currently",
        "right now",
        "working on",
        "focus",
        "hiện tại",
        "đang làm",
        "đang học"
      ),
    ],
  },
  {
    intent: "social",
    weight: 3,
    patterns: [
      phrase(
        "github",
        "linkedin",
        "social",
        "twitter",
        "facebook",
        "mạng xã hội"
      ),
    ],
  },
]

function detectLocale(text: string): Locale {
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)) {
    return "vi"
  }

  if (
    /(^|[^\p{L}\p{N}_])(là|gì|nào|không|được|với|cho|tôi|mình|bạn|dự án|kinh nghiệm|liên hệ|thuê|stack|giới thiệu)(?![\\p{L}\\p{N}_])/iu.test(
      text
    )
  ) {
    return "vi"
  }

  return "en"
}

function scoreIntent(text: string): Intent {
  const normalized = text.trim().toLowerCase()
  if (!normalized) return "greeting"

  const scores = new Map<Intent, number>()

  for (const rule of INTENT_RULES) {
    let hits = 0
    for (const pattern of rule.patterns) {
      if (pattern.test(normalized)) hits += 1
    }
    if (hits > 0) {
      scores.set(rule.intent, (scores.get(rule.intent) ?? 0) + hits * rule.weight)
    }
  }

  let best: Intent = "fallback"
  let bestScore = 0
  for (const [intent, score] of scores) {
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }

  return bestScore > 0 ? best : "fallback"
}

function stripMarkdownLight(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^[-*]\s+/gm, "• ")
    .trim()
}

function projectSummary(description?: string) {
  if (!description) return null
  return (
    description
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 0 && !line.startsWith("-")) ?? null
  )
}

function buildProjectsReply(locale: Locale) {
  const projects = locale === "vi" ? PROJECTS_VI : PROJECTS_EN
  const featured = projects.slice(0, 5)

  const lines = featured.map((project) => {
    const summary = projectSummary(project.description)
    const period = `${project.period.start}${project.period.end ? ` – ${project.period.end}` : ""}`
    const caseStudy = project.caseStudySlug
      ? locale === "vi"
        ? `  Case study: /vi/projects/${project.caseStudySlug}`
        : `  Case study: /projects/${project.caseStudySlug}`
      : null

    return [
      `- **${project.title}** (${period})`,
      summary ? `  ${summary}` : null,
      `  Stack: ${project.skills.slice(0, 4).join(", ")}`,
      caseStudy,
    ]
      .filter(Boolean)
      .join("\n")
  })

  if (locale === "vi") {
    return [
      `River đã ship nhiều frontend client (thương hiệu ẩn danh vì NDA). Một vài highlight:`,
      "",
      ...lines,
      "",
      `Xem đầy đủ tại [/vi/projects](/vi/projects). Snapshot nhanh cho recruiter: [/vi/hire](/vi/hire).`,
    ].join("\n")
  }

  return [
    `River has shipped several client frontends (brands anonymized under NDA). Highlights:`,
    "",
    ...lines,
    "",
    `Browse them all at [/projects](/projects). Recruiter snapshot: [/hire](/hire).`,
  ].join("\n")
}

function buildStackReply(locale: Locale) {
  const titles = TECH_STACK.map((item) => item.title)
  const core = titles.slice(0, 10).join(", ")

  if (locale === "vi") {
    return [
      `Stack chính của River: **Next.js, React, TypeScript, Tailwind CSS, Shadcn/UI, GSAP, WordPress, Docker**.`,
      "",
      `Trên site còn liệt kê: ${core}${titles.length > 10 ? ",…" : ""}.`,
      "",
      `Chi tiết nằm ở phần Tech Stack trên [/vi](/vi) hoặc snapshot [/vi/hire](/vi/hire).`,
    ].join("\n")
  }

  return [
    `River's day-to-day stack: **Next.js, React, TypeScript, Tailwind CSS, Shadcn/UI, GSAP, WordPress, Docker**.`,
    "",
    `Also listed on the site: ${core}${titles.length > 10 ? ",…" : ""}.`,
    "",
    `See Tech Stack on the [homepage](/) or the [/hire](/hire) snapshot.`,
  ].join("\n")
}

function buildExperienceReply(locale: Locale) {
  const experiences = getWorkExperiencesByLocale(locale)

  const lines = experiences.map((company) => {
    const roles = company.positions
      .map((position) => {
        const end = position.employmentPeriod.end ?? (locale === "vi" ? "Hiện tại" : "Present")
        return `  • ${position.title} (${position.employmentPeriod.start} – ${end})`
      })
      .join("\n")
    return `- **${company.companyName}**\n${roles}`
  })

  if (locale === "vi") {
    return [
      `${USER_VI.displayName} (River) — **${USER_VI.jobTitle}** với 2+ năm kinh nghiệm.`,
      "",
      ...lines,
      "",
      `CV đầy đủ: [/vi/resume](/vi/resume).`,
    ].join("\n")
  }

  return [
    `${USER_EN.displayName} (River) — **${USER_EN.jobTitle}** with 2+ years of experience.`,
    "",
    ...lines,
    "",
    `Full resume: [/resume](/resume).`,
  ].join("\n")
}

function buildEducationReply(locale: Locale) {
  const education = getEducationByLocale(locale)
  const lines = education.map((school) => {
    const roles = school.positions
      .map((position) => {
        const end = position.employmentPeriod.end ?? (locale === "vi" ? "Hiện tại" : "Present")
        return `  • ${position.title} (${position.employmentPeriod.start} – ${end})`
      })
      .join("\n")
    return `- **${school.companyName}**\n${roles}`
  })

  if (locale === "vi") {
    return [`Học vấn của River:`, "", ...lines, "", `Xem thêm ở [/vi](/vi)#education.`].join("\n")
  }

  return [`River's education:`, "", ...lines, "", `More on the homepage [/](/)#education.`].join("\n")
}

function buildAboutReply(locale: Locale) {
  const about = stripMarkdownLight(locale === "vi" ? USER_VI.about : USER_EN.about)
  const user = locale === "vi" ? USER_VI : USER_EN
  const jobs = user.jobs.map((job) => `${job.title} @ ${job.company}`).join("; ")

  if (locale === "vi") {
    return [
      about,
      "",
      `Hiện tập trung: ${jobs}.`,
      `Địa điểm: ${user.address}.`,
      `Site: ${user.website}`,
    ].join("\n")
  }

  return [
    about,
    "",
    `Current focus: ${jobs}.`,
    `Based in ${user.address}.`,
    `Site: ${user.website}`,
  ].join("\n")
}

function buildHireReply(locale: Locale) {
  if (locale === "vi") {
    return [
      `River đang **mở nhận hợp tác** frontend — brand site, product UI, WordPress headless, rebuild Next.js.`,
      "",
      `Cách làm việc nhanh:`,
      `1. Gửi brief ngắn (mục tiêu, timeline, ngân sách ước lượng) qua [/vi/contact](/vi/contact)`,
      `2. Hoặc xem snapshot recruiter tại [/vi/hire](/vi/hire)`,
      `3. CV chi tiết: [/vi/resume](/vi/resume)`,
      "",
      `Thường phản hồi trong **1–2 ngày làm việc**. Remote từ Hà Nội (UTC+7), nhận contract / full-time frontend.`,
    ].join("\n")
  }

  return [
    `River is **open to frontend work** — brand sites, product UIs, WordPress headless, and Next.js rebuilds.`,
    "",
    `Fastest path:`,
    `1. Send a short brief (goal, timeline, rough budget) via [/contact](/contact)`,
    `2. Or skim the recruiter snapshot at [/hire](/hire)`,
    `3. Full CV: [/resume](/resume)`,
    "",
    `Typical reply within **1–2 business days**. Remote-friendly from Hanoi (UTC+7); open to contract or full-time frontend roles.`,
  ].join("\n")
}

function buildContactReply(locale: Locale) {
  const social = SOCIAL_LINKS.map((link) => `- [${link.title}](${link.href})`).join("\n")

  if (locale === "vi") {
    return [
      `Liên hệ River qua [/vi/contact](/vi/contact) — form, email, hoặc kênh nhanh.`,
      "",
      social,
      "",
      `Muốn thuê / hợp tác? Xem thêm [/vi/hire](/vi/hire). Email/phone cũng có trên [/vi/resume](/vi/resume).`,
    ].join("\n")
  }

  return [
    `Reach River at [/contact](/contact) — form, email, or a direct channel.`,
    "",
    social,
    "",
    `Looking to hire? See [/hire](/hire). Email/phone are also on [/resume](/resume).`,
  ].join("\n")
}

function buildResumeReply(locale: Locale) {
  if (locale === "vi") {
    return [
      `Hồ sơ đầy đủ (kinh nghiệm, kỹ năng, liên hệ): [/vi/resume](/vi/resume).`,
      `Muốn bản rút gọn cho hiring: [/vi/hire](/vi/hire).`,
    ].join("\n")
  }
  return [
    `Full resume (experience, skills, contact): [/resume](/resume).`,
    `Shorter hiring snapshot: [/hire](/hire).`,
  ].join("\n")
}

function buildBlogReply(locale: Locale) {
  if (locale === "vi") {
    return [
      `River viết về Next.js, WordPress headless, GSAP, Docker và Core Web Vitals — từ việc đã ship thật.`,
      `Đọc tại [/vi/blog](/vi/blog).`,
    ].join("\n")
  }

  return [
    `River writes about Next.js, WordPress headless, GSAP, Docker, and Core Web Vitals — grounded in shipped work.`,
    `Read the posts at [/blog](/blog).`,
  ].join("\n")
}

function buildNowReply(locale: Locale) {
  const now = locale === "vi" ? NOW_VI : NOW_EN
  const lines = now.items.map(
    (item) => `- **${item.label}:** ${item.title}${item.note ? ` — ${item.note}` : ""}`
  )

  if (locale === "vi") {
    return [`Đang diễn ra (cập nhật ${now.updatedAt}):`, "", ...lines].join("\n")
  }

  return [`Right now (updated ${now.updatedAt}):`, "", ...lines].join("\n")
}

function buildSocialReply(locale: Locale) {
  const social = SOCIAL_LINKS.map(
    (link) => `- [${link.title}](${link.href}) — ${link.description}`
  ).join("\n")

  if (locale === "vi") {
    return [`River online tại:`, "", social].join("\n")
  }

  return [`Find River on:`, "", social].join("\n")
}

function buildGreetingReply(locale: Locale) {
  if (locale === "vi") {
    return [
      `Chào! Mình là **River Bot** — trợ lý portfolio của ${USER_VI.displayName} (River), ${USER_VI.jobTitle} ở ${USER_VI.address}.`,
      "",
      `Hỏi về dự án, stack, kinh nghiệm, học vấn, hoặc cách liên hệ / thuê River nhé.`,
    ].join("\n")
  }

  return [
    `Hey — I'm **River Bot**, the portfolio assistant for ${USER_EN.displayName} (River), a ${USER_EN.jobTitle} in ${USER_EN.address}.`,
    "",
    `Ask about projects, stack, experience, education, or how to get in touch / hire River.`,
  ].join("\n")
}

function buildFallbackReply(locale: Locale) {
  if (locale === "vi") {
    return [
      `Mình chỉ trả lời về portfolio và công việc của River — dự án, stack, kinh nghiệm, học vấn, blog, hoặc cách liên hệ / thuê.`,
      "",
      `Gợi ý: "River dùng stack gì?", "River đã làm dự án nào?", hoặc "Làm sao để thuê River?"`,
    ].join("\n")
  }

  return [
    `I only chat about River's portfolio and work — projects, stack, experience, education, blog, or how to get in touch / hire.`,
    "",
    `Try: "What's River's stack?", "What projects has River shipped?", or "How can I hire River?"`,
  ].join("\n")
}

export function buildLocalReply(userText: string): {
  reply: string
  locale: Locale
  intent: Intent
} {
  const locale = detectLocale(userText)
  const intent = scoreIntent(userText)

  const replyByIntent: Record<Intent, (locale: Locale) => string> = {
    greeting: buildGreetingReply,
    about: buildAboutReply,
    projects: buildProjectsReply,
    stack: buildStackReply,
    experience: buildExperienceReply,
    education: buildEducationReply,
    hire: buildHireReply,
    contact: buildContactReply,
    resume: buildResumeReply,
    blog: buildBlogReply,
    now: buildNowReply,
    social: buildSocialReply,
    fallback: buildFallbackReply,
  }

  return {
    locale,
    intent,
    reply: replyByIntent[intent](locale),
  }
}

export function extractLatestUserText(
  messages: Array<{
    role?: string
    parts?: Array<{ type?: string; text?: string }>
    content?: string
  }>
): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i]
    if (message?.role !== "user") continue

    if (typeof message.content === "string" && message.content.trim()) {
      return message.content.trim()
    }

    if (Array.isArray(message.parts)) {
      const text = message.parts
        .filter((part) => part.type === "text" && part.text)
        .map((part) => part.text)
        .join("")
        .trim()
      if (text) return text
    }
  }

  return ""
}
