import type { User } from "@/features/portfolio/types/user"

export const USER = {
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
  about: `- **Frontend Developer** with 1+ year of experience, known for **pixel-perfect execution** and **strong attention to detail** in building high-quality web applications.
- Skilled in **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and modern front-end technologies; creating **user-centric** web and mobile experiences.
- Passionate about exploring **new technologies** and turning ideas into reality through **polished, thoughtfully crafted personal projects**.
- Proficient in **API integration** and working with both **RESTful APIs** and **GraphQL** to build dynamic, data-driven applications.
- Experienced in **version control** using **Git** and platforms like **GitHub** and **GitLab** to collaborate with teams on large-scale projects.
- Strong focus on **performance optimization**, employing techniques like **lazy loading**, **code splitting**, and **image optimization** to enhance user experience.
- Collaborative team player with a passion for **problem-solving**, always seeking ways to improve code quality, efficiency, and scalability.
- Familiar with **UI/UX principles** and translating design assets from **Figma**, **Sketch**, and **Adobe XD** into pixel-perfect, responsive user interfaces.
- Eager to continue learning and adapting to the latest web development trends and best practices in the ever-evolving tech landscape.
`,
  avatar: "https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/465750960_1916864268794763_162486911259508675_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=9zFetTnkmCwQ7kNvwFOiEvJ&_nc_oc=Adn1jpEjKZ_RX5s5qaEzYs0COsT8XtmPclFSNxFtL6cSF1pyCqIbYCskXJguj09evxo&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=akiutr7Fs4cAtoJBWIS1oQ&oh=00_Afs2nL7mKX_vaH_w7p3LSO8YVpj_EY8yaYVWVLvYBp0Ifg&oe=6991A37D",
  ogImage:
    "https://assets.chanhdai.com/images/screenshot-og-image-dark.png?v=6",
  namePronunciationUrl: "/audio/chanhdai.mp3",
  affiliateBadge: {
    name: "OKHub Agency",
    url: "https://okhub.vn",
    logo: "https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/476001178_609089631724531_2211695452587996090_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=8kr96j_fyhQQ7kNvwEo8BTb&_nc_oc=AdnIdKyx78yg4rYpA-ZoMCC_DiUZbXrx6Ov62Jjdws7HyGjwd36OGFgb2-CU4brd5Mk&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=75lg-oTQ9V83_GIWV6Y2eQ&oh=00_Afs1R_DrfuA31ImKGlejmn2YCrXnO4VFmYg-OyodFOWeXw&oe=6991C158",
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
