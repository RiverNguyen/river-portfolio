import { USER } from "@/features/portfolio/data/user"
import type { NavItem } from "@/types/nav"

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.APP_URL || "https://rivernguyen.id.vn",
  ogImage: USER.ogImage,
  description: `${USER.displayName} (Nguyễn Đình Giang) — ${USER.jobTitle} based in Ha Noi. Portfolio, projects, blog and contact.`,
  keywords: USER.keywords,
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const MAIN_NAV: NavItem[] = [
  {
    title: "Portfolio",
    href: "/",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Resume",
    href: "/resume",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
]

export const GITHUB_USERNAME = "RiverNguyen"
export const SOURCE_CODE_GITHUB_REPO = "RiverNguyen/river-portfolio"
export const SOURCE_CODE_GITHUB_URL =
  "https://github.com/RiverNguyen/river-portfolio"

export const SPONSORSHIP_URL = "https://github.com/sponsors/RiverNguyen"

/** URL đến file CV (PDF). Đặt file trong public/ hoặc dùng URL ngoài. */
export const RESUME_PDF_URL = "/pdf/resume.pdf"

export const UTM_PARAMS = {
  utm_source: "rivernguyen.id.vn",
}
