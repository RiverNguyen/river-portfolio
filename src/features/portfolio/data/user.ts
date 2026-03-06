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
  website: "https://river.com",
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
  avatar: "https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-6/465750960_1916864268794763_162486911259508675_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeH4e4rbPOtIG0ejmd_73JF0kQuy6LI79xGRC7Losjv3EflBaPx9bBTszy0BZVpW6osXQYT9k6wNe_-aZ66upcWT&_nc_ohc=Ao8RW4gUBZ0Q7kNvwGmOWcV&_nc_oc=Admf9f-RhrkbtUgr1oBYrl8xs8CE-pat-PyF1URwrGFa_XPk3C9BnZ6d6_n_Yw1AQ48&_nc_zt=23&_nc_ht=scontent.fhan5-9.fna&_nc_gid=Ze3VABcTjV6DMGPw9HwoCA&_nc_ss=8&oh=00_Afzl_y5Puw_M38R_DxvOUb3eX-oOUyW07g8B7P8G07TEhA&oe=69AB90FD",
  ogImage:
    "https://assets.chanhdai.com/images/screenshot-og-image-dark.png?v=6",
  namePronunciationUrl: "",
  affiliateBadge: {
    name: "OKHub Agency",
    url: "https://okhub.vn",
    logo: "https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-6/476001178_609089631724531_2211695452587996090_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeH-lXh65H-LAhS-U_gEUavoV64wTWjU6w5XrjBNaNTrDhjVNwh8_OOjfd9X51sXbm-3VXECb0QDnmgkIKY9l9wG&_nc_ohc=ftwmLwKiIhMQ7kNvwHJol7l&_nc_oc=AdmaI9IFUDJlWkh7NEowZnyqeCM4BHKRBiWJzXwknNeVpLjLKeq7nkc_gq1EiUg8ZTE&_nc_zt=23&_nc_ht=scontent.fhan5-8.fna&_nc_gid=uz7tPTrZR8ScA7lSM0_FoA&_nc_ss=8&oh=00_AfxkWINyVlT-KETrKgky8tnk0izl1FUUNg25ZnNhGeV9CQ&oe=69AB7698",
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
