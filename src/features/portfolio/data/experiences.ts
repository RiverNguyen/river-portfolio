import type { Experience } from "../types/experiences"

export const EXPERIENCES_EN: Experience[] = [
  {
    id: "bateco",
    companyName: "Bateco Group",
    companyLogo: "/bateco.webp",
    companyWebsite: "https://bateco.vn",
    positions: [
      {
        id: "6b469f04-835b-4895-8300-5363483a1531",
        title: "Web Developer",
        employmentPeriod: {
          start: "05.2026",
          end: "Present",
        },
        employmentType: "Full-time",
        icon: "code",
        description: `- **Web Developer** at **Bateco Group** (May 2026 - Present)  
  - Build and maintain responsive corporate websites with **Next.js** and **React.js**, optimized for performance, SEO and accessibility.
  - Integrate **RESTful APIs** to deliver dynamic content and interactive features across the group's business domains.
  - Use **GSAP**, **Tailwind CSS** and **Shadcn/UI** to create smooth animations and a polished, consistent UI.
  - Manage application state with **Zustand**; use **Docker** for reliable, reproducible development and deployment environments.
`,
        skills: [
          "Next.js",
          "React.js",
          "Docker",
          "Tailwind CSS",
          "Shadcn/UI",
          "RESTful APIs",
          "GSAP",
          "Zustand",
          "SEO",
          "Motion Animation",
        ],
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "okhub",
    companyName: "OKHub Agency",
    companyLogo: "/company.webp",
    companyWebsite: "https://okhub.vn",
    positions: [
      {
        id: "0C741FC7-A4C2-4B1D-857B-F3058CE8D9CE",
        title: "Web Developer",
        employmentPeriod: {
          start: "12.2024",
          end: "05.2026",
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
  },
  {
    id: "f8-technology-and-education-jsc",
    companyName: "F8 - Technology and Education JSC",
    companyLogo: "/education/f8.webp",
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
    id: "education-utc",
    companyName: "University of Transport and Communications",
    companyLogo: "/education/utc.webp",
    companyWebsite: "https://www.utc.edu.vn",
    positions: [
      {
        id: "9e1f1f4e-0e01-4f0c-9efb-427304527bc5",
        title: "Bachelor's Student",
        employmentPeriod: {
          start: "2025",
          end: "Present",
        },
        icon: "education",
        description: `
  - Currently studying at **University of Transport and Communications (UTC / GTVT)**.
  - Continuing academic growth in **Information Technology** while working as a frontend developer.
`,
        skills: [
          "Information Technology",
          "Web Development",
          "Computer Science",
        ],
      },
    ],
  },
  {
    id: "education-fpt",
    companyName: "FPT Polytechnic",
    companyLogo: "/education/fpt-polytechnic.webp",
    companyWebsite: "https://caodang.fpt.edu.vn",
    positions: [
      {
        id: "c47f5903-88ae-4512-8a50-0b91b0cf99b6",
        title: "Information Technology",
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
        employmentPeriod: {
          ...EXPERIENCES_EN[0]!.positions[0]!.employmentPeriod,
          end: "Hiện tại",
        },
        employmentType: "Toàn thời gian",
        description: `- **Lập trình viên Web** tại **Bateco Group** (05/2026 - Hiện tại)  
  - Xây dựng và bảo trì website doanh nghiệp responsive bằng **Next.js** và **React.js**, tối ưu hiệu năng, SEO và accessibility.
  - Tích hợp **RESTful APIs** để triển khai nội dung động và tính năng tương tác cho các lĩnh vực kinh doanh của tập đoàn.
  - Sử dụng **GSAP**, **Tailwind CSS** và **Shadcn/UI** để tạo animation mượt và giao diện nhất quán, chuyên nghiệp.
  - Quản lý state với **Zustand**; dùng **Docker** để đồng bộ môi trường phát triển và triển khai ổn định.
`,
      },
    ],
  },
  {
    ...EXPERIENCES_EN[1],
    positions: [
      {
        ...EXPERIENCES_EN[1]!.positions[0]!,
        title: "Lập trình viên Web",
        employmentPeriod: {
          ...EXPERIENCES_EN[1]!.positions[0]!.employmentPeriod,
          end: "05.2026",
        },
        employmentType: "Toàn thời gian",
        description: `- **Lập trình viên NextJS & WordPress** tại **OKHub Agency** (12/2024 - 05/2026)  
  - Xây dựng và bảo trì website **Next.js**, **React.js** và **WordPress** responsive, tối ưu hiệu năng, SEO và accessibility.
  - Tích hợp **RESTful APIs**, **Custom Post Types** và **ACF fields** để triển khai trải nghiệm động trên frontend Next.js.
  - Dùng **GSAP** và các thư viện UI hiện đại để tạo animation và tương tác mượt trên các dự án.
  - Quản lý state với **Redux**, **Zustand** và **Context API** để UI phức tạp dễ mở rộng và bảo trì.
  - Áp dụng best practices về hiệu năng, bảo mật và tương thích đa thiết bị, gồm code splitting, tối ưu hình ảnh và hardening cơ bản.
`,
      },
    ],
  },
  {
    ...EXPERIENCES_EN[2],
    companyName: "F8 - Công ty Cổ phần Công nghệ & Giáo dục",
    positions: [
      {
        ...EXPERIENCES_EN[2]!.positions[0]!,
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
    ...EXPERIENCES_EN[3],
    companyName: "Đại học Giao thông Vận tải",
    positions: [
      {
        ...EXPERIENCES_EN[3]!.positions[0]!,
        title: "Sinh viên",
        employmentPeriod: {
          start: "2025",
          end: "Hiện tại",
        },
        description: `
  - Đang học tại **Đại học Giao thông Vận tải (UTC / GTVT)**.
  - Tiếp tục nâng nền tảng **Công nghệ thông tin** song song với công việc frontend developer.
`,
      },
    ],
  },
  {
    ...EXPERIENCES_EN[4],
    companyName: "Cao đẳng FPT Polytechnic",
    positions: [
      {
        ...EXPERIENCES_EN[4]!.positions[0]!,
        title: "Công nghệ thông tin",
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
