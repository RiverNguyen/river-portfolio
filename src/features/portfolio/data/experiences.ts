import type { Experience } from "../types/experiences"

export const EXPERIENCES_EN: Experience[] = [
  {
    id: "okhub",
    companyName: "OKHub Agency",
    companyLogo: "/company.jpg",
    companyWebsite: "https://okhub.vn",
    positions: [
      {
        id: "0C741FC7-A4C2-4B1D-857B-F3058CE8D9CE",
        title: "Web Developer",
        employmentPeriod: {
          start: "12.2024",
          end: "Present",
        },
        employmentType: "Full-time",
        icon: "code",
        description: `- **NextJS & WordPress Developer** at **OKHub Agency** (Dec 2024 - Present)  
  - Build and maintain responsive **Next.js**, **React.js** and **WordPress** websites optimized for performance, SEO and accessibility.
  - Integrate **RESTful APIs**, **Custom Post Types** and **ACF fields** to deliver dynamic, data‑driven experiences in Next.js frontends.
  - Use **GSAP** and modern UI libraries to create smooth, engaging animations and interactions across projects.
  - Manage application state with **Redux**, **Zustand** and **Context API** to keep complex UIs scalable and maintainable.
  - Apply best practices for performance, security and cross‑device compatibility, including code splitting, image optimization and basic hardening.
`,
        skills: [
          "Next.js",
          "React.js",
          "Docker",
          "Tailwind CSS",
          "Shadcn/UI",
          "WordPress",
          "RESTful APIs",
          "Custom Post Types",
          "ACF Fields",
          "GSAP",
          "Zustand",
          "SEO",
          "Motion Animation",
          "UI/UX Design",
          "Figma",
        ],
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "f8-technology-and-education-jsc",
    companyName: "F8 - Technology and Education JSC",
    companyLogo: "https://khoahochatde.com/wp-content/uploads/2025/01/channels4_profile-2.jpg",
    positions: [
      {
        id: "3e831244-8d8c-41e2-b2ce-7f3946956afd",
        title: "Web Development Class Manager - Fullstack Developer",
        employmentPeriod: {
          start: "04.2024",
          end: "11.2024",
        },
        employmentType: "Full-time",
        description: `- **Web Development Class Manager & Fullstack Developer** at **F8 Technology and Education JSC** (Apr 2024 - Nov 2024)  
  - Managed and supported web development classes, assisting instructors and answering student questions.
  - Tracked student progress, graded assignments and gave feedback to improve learning outcomes.
  - Contributed to internal full‑stack projects, building responsive web applications with modern frontend and backend technologies.
`,
        icon: "code",
        skills: [
          "React",
          "Learning Management System",
          "Fullstack Development",
          "Agile",
          "Teamwork",
          "Research",
          "HTML",
          "CSS",
          "JavaScript",
          "PHP",
          "MySQL",
          "Laravel",
          "Node.js",
          "Express.js",
          "Socket.IO",
        ],
      },
    ],
  },
  {
    id: "education",
    companyName: "Education",
    companyLogo: "https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-35.jpg",
    positions: [
      {
        id: "c47f5903-88ae-4512-8a50-0b91b0cf99b6",
        title: "FPT Polytechnic",
        employmentPeriod: {
          start: "2022",
          end: "2025",
        },
        icon: "education",
        description: `
  - **Degree**: Information Technology (GPA 3.6/4), focus on **Web Development**.  
  - Gained practical experience with **Next.js**, **React.js**, **WordPress** and full‑stack projects during coursework and team assignments.
  - Built a solid foundation in **computer science**, including programming, databases and algorithms.
`,
        skills: [
          "HTML",
          "CSS",
          "JavaScript",
          "PHP",
          "MySQL",
          "Laravel",
          "Node.js",
          "Express.js",
          "Socket.IO",
          "React.js",
          "Next.js",
          "WordPress",
          "Tailwind CSS",
          "Shadcn/UI",
        ],
      },
    ],
  },
]

export const EXPERIENCES_VI: Experience[] = [
  {
    ...EXPERIENCES_EN[0],
    positions: [
      {
        ...EXPERIENCES_EN[0]!.positions[0]!,
        title: "Lập trình viên Web",
        employmentPeriod: { ...EXPERIENCES_EN[0]!.positions[0]!.employmentPeriod, end: "Hiện tại" },
        employmentType: "Toàn thời gian",
        description: `- **Lập trình viên NextJS & WordPress** tại **OKHub Agency** (12/2024 - Hiện tại)  
  - Xây dựng và bảo trì website **Next.js**, **React.js** và **WordPress** responsive, tối ưu hiệu năng, SEO và accessibility.
  - Tích hợp **RESTful APIs**, **Custom Post Types** và **ACF fields** để tạo trải nghiệm động, dữ liệu-driven cho frontend Next.js.
  - Sử dụng **GSAP** và các UI libraries hiện đại để tạo animation/interaction mượt và hấp dẫn.
  - Quản lý state bằng **Redux**, **Zustand** và **Context API** để UI phức tạp vẫn dễ mở rộng và bảo trì.
  - Áp dụng best practices về hiệu năng, bảo mật và tương thích đa thiết bị: code splitting, tối ưu hình ảnh và hardening cơ bản.
`,
      },
    ],
  },
  {
    ...EXPERIENCES_EN[1],
    companyName: "F8 - Công ty Cổ phần Công nghệ & Giáo dục",
    positions: [
      {
        ...EXPERIENCES_EN[1]!.positions[0]!,
        title: "Quản lý lớp Web Development - Lập trình viên Fullstack",
        employmentType: "Toàn thời gian",
        description: `- **Quản lý lớp Web Development & Lập trình viên Fullstack** tại **F8** (04/2024 - 11/2024)  
  - Quản lý và hỗ trợ các lớp học lập trình web, hỗ trợ giảng viên và giải đáp thắc mắc cho học viên.
  - Theo dõi tiến độ, chấm bài và phản hồi để cải thiện kết quả học tập.
  - Tham gia các dự án nội bộ full-stack, xây dựng ứng dụng web responsive với công nghệ frontend/backend hiện đại.
`,
      },
    ],
  },
  {
    ...EXPERIENCES_EN[2],
    companyName: "Học vấn",
    positions: [
      {
        ...EXPERIENCES_EN[2]!.positions[0]!,
        title: "Cao đẳng FPT Polytechnic",
        description: `
  - **Ngành**: Công nghệ Thông tin (GPA 3.6/4), tập trung **Phát triển Web**.  
  - Có kinh nghiệm thực hành với **Next.js**, **React.js**, **WordPress** và các dự án full-stack trong quá trình học và làm bài nhóm.
  - Xây dựng nền tảng vững về **khoa học máy tính**, bao gồm lập trình, cơ sở dữ liệu và thuật toán.
`,
      },
    ],
  },
]

// Backward-compatible export (current site defaults to English).
export const EXPERIENCES = EXPERIENCES_EN

export type PortfolioLocale = "en" | "vi"

export function getExperiencesByLocale(locale: PortfolioLocale): Experience[] {
  return locale === "vi" ? EXPERIENCES_VI : EXPERIENCES_EN
}
