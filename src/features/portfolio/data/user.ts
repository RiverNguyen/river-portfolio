import type { User } from "@/features/portfolio/types/user"

export const USER_EN = {
  firstName: "Giang",
  lastName: "Nguyễn Đình",
  displayName: "Giang Nguyễn Đình",
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
  website: "http://river-portfolio.vercel.app",
  jobTitle: "Web Developer",
  jobs: [
    {
      title: "Web Developer",
      company: "OKHub Agency",
      website: "https://okhub.vn",
    },
  ],
  about: `- **Frontend Developer** with 1.5+ year of experience delivering pixel-perfect, high-quality web applications.
- Skilled in **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and modern front-end tooling to build user-centric experiences.
- Strong in **API integration** with **REST** and **GraphQL**, and collaborative workflows using **Git**, **GitHub**, and **GitLab**.
- Focused on **performance**, applying lazy loading, code splitting, and image optimization to keep interfaces fast.
- Continuously learning, with solid **UI/UX** fundamentals and experience turning Figma and other design assets into responsive interfaces.`,
  avatar: "/avatar.jpg",
  ogImage:
    "/image.png",
  namePronunciationUrl: "",
  affiliateBadge: {
    name: "OKHub Agency",
    url: "https://okhub.vn",
    logo: "/company.jpg",
  },
  timeZone: "Asia/Ho_Chi_Minh",
  keywords: [
    "river",
    "nguyen giang",
    "nguyen giang dinh",
    "giang nguyen dinh",
    "giang nguyen",
    "giang",
    "nguyen",
    "dinh",
    "web developer",
    "full stack developer",
    "next.js developer",
    "react developer",
    "type script developer",
    "javascript developer",
    "node.js developer",
    "wordpress developer",
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
  jobTitle: "Lập trình viên Web",
  jobs: [
    {
      title: "Lập trình viên Web",
      company: "OKHub Agency",
      website: "https://okhub.vn",
    },
  ],
  about: `- **Lập trình viên Frontend** với hơn 1,5 năm kinh nghiệm xây dựng các ứng dụng web chất lượng cao, pixel-perfect.
- Thành thạo **Next.js**, **React**, **TypeScript**, **Tailwind CSS** và các công cụ front-end hiện đại để tạo trải nghiệm hướng người dùng.
- Mạnh về **tích hợp API** với **REST** và **GraphQL**, làm việc nhóm với **Git**, **GitHub** và **GitLab**.
- Tập trung vào **hiệu năng**: áp dụng lazy loading, code splitting và tối ưu hình ảnh để giao diện luôn nhanh.
- Luôn học hỏi, có nền tảng **UI/UX** tốt và kinh nghiệm chuyển thiết kế Figma (và các design assets khác) thành giao diện responsive.`,
  keywords: [
    ...USER_EN.keywords,
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
