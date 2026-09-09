import type { User } from "@/features/portfolio/types/user"

export const USER_EN = {
  firstName: "Giang",
  lastName: "Nguyễn",
  displayName: "Nguyễn Đình Giang",
  username: "river",
  gender: "male",
  pronouns: "he/him",
  bio: "Web Developer",
  flipSentences: [
    "Software Engineer",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "Node.js Developer",
    "WordPress Developer",
  ],
  address: "Ha Noi, Viet Nam",
  phoneNumber: "MDM0NTYxMzA5MA==", // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  email: "bmdpYW5nMTMwOUBnbWFpbC5jb20=", // base64 encoded
  website: "https://rivernguyen.id.vn",
  jobTitle: "Frontend Developer",
  jobs: [
    {
      title: "Frontend Developer",
      company: "Bateco Group",
      website: "https://bateco.vn",
    },
  ],
  about: `I'm **Nguyễn Đình Giang** (River) — a **Frontend Developer** with 1.5+ years of experience shipping polished, high-performance web products from design to production.
- Build modern UIs with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**, turning Figma into responsive, accessible interfaces.
- Integrate **REST** and **GraphQL** APIs, and collaborate smoothly with teams via **Git**, **GitHub**, and **GitLab**.
- Care about speed: lazy loading, code splitting, image optimization, and clean component architecture.
- Use **Docker** for consistent local and deployment environments, and keep learning to sharpen both craft and delivery.`,
  avatar: "/avatar.jpeg",
  ogImage: "/image.png",
  namePronunciationUrl: "/audio/ui-sounds/voice.mp3",
  affiliateBadge: {
    name: "Bateco Group",
    url: "https://bateco.vn",
    logo: "/bateco.webp",
  },
  timeZone: "Asia/Ho_Chi_Minh",
  keywords: [
    "Nguyễn Đình Giang",
    "Nguyen Dinh Giang",
    "nguyễn đình giang",
    "nguyen dinh giang",
    "Giang Nguyễn Đình",
    "Giang Nguyen Dinh",
    "giang nguyễn đình",
    "giang nguyen dinh",
    "River Nguyen",
    "rivernguyen",
    "river",
    "frontend developer Hà Nội",
    "web developer",
    "full stack developer",
    "next.js developer",
    "react developer",
    "typescript developer",
    "javascript developer",
    "node.js developer",
    "wordpress developer",
    "frontend developer",
  ],
  dateCreated: "2026-02-10", // YYYY-MM-DD
} satisfies User

export const USER_VI = {
  ...USER_EN,
  pronouns: "anh",
  bio: "Lập trình viên Web",
  flipSentences: [
    "Kỹ sư phần mềm",
    "Lập trình viên Full-stack",
    "Lập trình viên Next.js",
    "Lập trình viên React",
    "Lập trình viên TypeScript",
    "Lập trình viên JavaScript",
    "Lập trình viên Node.js",
    "Lập trình viên WordPress",
  ],
  address: "Hà Nội, Việt Nam",
  jobTitle: "Lập trình viên Frontend",
  jobs: [
    {
      title: "Lập trình viên Frontend",
      company: "Bateco Group",
      website: "https://bateco.vn",
    },
  ],
  about: `Tôi là **Nguyễn Đình Giang** (River) — **Lập trình viên Frontend** với hơn 1,5 năm kinh nghiệm đưa sản phẩm web từ thiết kế đến production, chú trọng chất lượng và hiệu năng.
- Xây dựng UI hiện đại với **Next.js**, **React**, **TypeScript** và **Tailwind CSS**; chuyển Figma thành giao diện responsive, dễ dùng.
- Tích hợp API **REST** và **GraphQL**, phối hợp nhóm mượt với **Git**, **GitHub** và **GitLab**.
- Ưu tiên tốc độ: lazy loading, code splitting, tối ưu hình ảnh và kiến trúc component gọn.
- Dùng **Docker** để đồng bộ môi trường local và deploy, đồng thời luôn học để nâng kỹ năng lẫn cách làm việc.`,
  keywords: [
    ...USER_EN.keywords,
    "lập trình viên frontend",
    "lập trình viên web",
    "lập trình viên full stack",
    "lập trình viên next.js",
    "lập trình viên react",
    "lập trình viên typescript",
    "lập trình viên javascript",
    "lập trình viên node.js",
    "lập trình viên wordpress",
  ],
} satisfies User

// Backward-compatible export (current site defaults to English).
export const USER = USER_EN

export type PortfolioLocale = "en" | "vi"

export function getUserByLocale(locale: PortfolioLocale): User {
  return locale === "vi" ? USER_VI : USER_EN
}
