import type { Project } from "../types/projects"

export const PROJECTS: Project[] = [
  {
    id: "mbbank-brand-site",
    title: "MBBank Brand Website",
    period: {
      start: "10.2025",
      end: "Now",
    },
    logo: "https://rubicmarketing.com/wp-content/uploads/2022/11/y-nghia-logo-mb-bank-2.jpg",
    link: "",
    skills: [
      "NextJS",
      "Brand Marketing",
      "Landing Page",
      "Animation",
      "GSAP",
      "Tailwind CSS",
      "ShadCn UI",
      "Motion UI",
    ],
    description: `A marketing website for MBBank focusing on brand presence, product highlights, and customer acquisition.
- Designed and implemented multi-section landing pages to communicate core banking products and brand messages.
- Built responsive layouts and smooth scrolling/animation effects for a premium brand feel.
- Optimized content structure, SEO, and performance to support marketing campaigns and traffic spikes.
- Collaborated with marketing team to quickly iterate on content and visuals for different campaigns.`,
    isExpanded: true,
    images: [
      "/projects/mbbank/image.png",
      "/projects/mbbank/image-1.png",
      "/projects/mbbank/image-2.png",
    ],
  },
  {
    id: "okhub-agency",
    title: "OKHub Agency",
    period: {
      start: "10.2025",
      end: "01.2026",
    },
    link: "https://okhub.vn",
    skills: [
      "WordPress + NextJS",
      "REST API",
      "ShadCn UI",
      "Tailwind CSS",
      "GSAP",
      "Swiper",
      "Motion UI"
    ],
    description: `- Built responsive **Next.js** & **React.js** apps with cross-device compatibility.
- Developed custom **WordPress themes** optimized for performance, SEO, and accessibility.
- Integrated **RESTful APIs** for dynamic, interactive user experiences.
- Created **Custom Post Types** & **ACF fields** exposed via **REST API** for **Next.js** frontends.
- Used **GSAP** for smooth animations across WordPress and Next.js projects.
- Managed state with **Redux**, **Zustand**, and **Context API**.
- Applied SEO best practices: **lazy loading**, **code splitting**, and **image optimization**.
- Integrated payment gateways and booking forms for e-commerce platforms.
- Ensured cross-browser compatibility and mobile responsiveness.
- Implemented security measures: file permissions, **reCAPTCHA**, and login rate limiting.`,
    logo: "https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-6/476001178_609089631724531_2211695452587996090_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeH-lXh65H-LAhS-U_gEUavoV64wTWjU6w5XrjBNaNTrDhjVNwh8_OOjfd9X51sXbm-3VXECb0QDnmgkIKY9l9wG&_nc_ohc=ftwmLwKiIhMQ7kNvwHJol7l&_nc_oc=AdmaI9IFUDJlWkh7NEowZnyqeCM4BHKRBiWJzXwknNeVpLjLKeq7nkc_gq1EiUg8ZTE&_nc_zt=23&_nc_ht=scontent.fhan5-8.fna&_nc_gid=uz7tPTrZR8ScA7lSM0_FoA&_nc_ss=8&oh=00_AfxkWINyVlT-KETrKgky8tnk0izl1FUUNg25ZnNhGeV9CQ&oe=69AB7698",
    images: [
      "/projects/okhub/image-1.png",
      "/projects/okhub/image-2.png",
      "/projects/okhub/image-3.png"
    ],
    isExpanded: true
  },
  {
    id: "tiem-tour",
    title: "Tiem Tour",
    period: {
      start: "06.2025",
      end: "08.2025",
    },
    link: "https://tiemtourshagiang.com",
    skills: [
      "WordPress + NextJS",
      "REST API",
      "ShadCn UI",
      "Tailwind CSS",
      "GSAP",
      "Swiper"
    ],
    description: `A tour booking website that allows users to search and filter tours by destination, date, duration, and price.
It also supports custom tour requests where users can personalize itineraries based on their preferences. The platform provides real-time availability and pricing, ensuring a smooth and intuitive booking experience.
- Built project base, UI, and animation from design.
- Created custom post type and ACF to develop REST API from WordPress to serve data to Next.js interface.
- Integrated payment (OnePay) and submit form for admin and user.`,
    logo: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/ee/63/d7/caption.jpg?w=1200&h=-1&s=1",
    isExpanded: true,
    images: [
      "/projects/tiemtour/image.png",
      "/projects/tiemtour/image-1.png",
      "/projects/tiemtour/image-2.png",
    ],
  },
  {
    id: "zio-hair",
    title: "Zio Hair",
    period: {
      start: "05.2025",
      end: "06.2025",
    },
    link: "https://ziohair.vn",
    skills: [
      "WordPress + NextJS",
      "REST API",
      "ShadCn UI",
      "Tailwind CSS",
      "GSAP",
      "Swiper"
    ],
    description: `An online platform that allows customers to sign up, log in, and book hair salon appointments by selecting preferred date, time, and stylist. Users can browse available services and hair care products, add them to the shopping cart, and complete purchases through online payment.
- Managed user registration, login, and account management.
- Implemented appointment booking by date, time, and stylist.
- Developed shopping cart for services and hair care products.
- Integrated online payment and booking confirmation notifications.
- Created admin dashboard to manage appointments, services, and products.`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiileH9YX6r57Y87qrMOBjgre2Eyxm-YkBSw&s",
  },
  {
    id: "lotus-charm-travel",
    title: "Lotus Charm Travel",
    period: {
      start: "04.2025",
      end: "06.2025",
    },
    link: "https://lotuscharmtravel.com",
    skills: [
      "WordPress (Headless CMS)",
      "REST API",
      "GSAP"
    ],
    description: `A personalized tour booking platform that allows users to search and filter tours by destination, date, duration, and budget. The system also supports custom tour requests, enabling travelers to design itineraries tailored to their preferences. With multilingual support (English, Chinese) and real-time availability, the website ensures a smooth, user-friendly booking experience.
- Developed the project base, responsive UI, and smooth animations from design (Figma).
- Built Custom Post Types and ACF fields in WordPress to expose data via REST API for the Next.js frontend.
- Implemented tour filtering by destination, duration, date, and price.
- Integrated payment gateway (Megapay) and booking forms for both admin and users.
- Optimized performance (PageSpeed Insights, lazy loading, image optimization, code splitting).
- Ensured SEO best practices and multilingual functionality for international visitors.`,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq2VtSbipILgZ2kG-372MiAbom0460gO_Vhg&s",
  }
]
