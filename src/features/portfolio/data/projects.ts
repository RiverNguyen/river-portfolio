import type { Project } from "../types/projects"

export const PROJECTS: Project[] = [
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
    isExpanded: true
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
    isExpanded: true
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
    isExpanded: true
  }
]
