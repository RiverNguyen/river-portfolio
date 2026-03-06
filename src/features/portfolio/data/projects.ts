import type { Project } from "../types/projects"

export const PROJECTS_EN: Project[] = [
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

export const PROJECTS_VI: Project[] = [
  {
    ...PROJECTS_EN[0],
    title: "Website thương hiệu MBBank",
    period: { ...PROJECTS_EN[0].period, end: "Hiện tại" },
    description: `Website marketing cho MBBank, tập trung vào nhận diện thương hiệu, điểm nổi bật sản phẩm và thu hút khách hàng.
- Thiết kế và triển khai các landing page nhiều section để truyền tải thông điệp thương hiệu và sản phẩm cốt lõi.
- Xây dựng layout responsive và hiệu ứng cuộn/animation mượt để tạo cảm giác “premium”.
- Tối ưu cấu trúc nội dung, SEO và hiệu năng để hỗ trợ chiến dịch marketing và những thời điểm tăng traffic.
- Phối hợp chặt chẽ với team marketing để cập nhật nội dung và hình ảnh nhanh theo từng chiến dịch.`,
  },
  {
    ...PROJECTS_EN[1],
    title: "OKHub Agency",
    description: `- Xây dựng ứng dụng **Next.js** & **React.js** responsive, tương thích đa thiết bị.
- Phát triển **theme WordPress** tuỳ biến, tối ưu hiệu năng, SEO và accessibility.
- Tích hợp **RESTful APIs** để tạo trải nghiệm tương tác, dữ liệu động.
- Tạo **Custom Post Types** & **ACF fields** và expose qua **REST API** cho frontend **Next.js**.
- Dùng **GSAP** để tạo animation mượt cho cả dự án WordPress và Next.js.
- Quản lý state bằng **Redux**, **Zustand** và **Context API**.
- Áp dụng best practices SEO: **lazy loading**, **code splitting**, **tối ưu hình ảnh**.
- Tích hợp cổng thanh toán và form booking cho nền tảng thương mại điện tử.
- Đảm bảo tương thích trình duyệt và tối ưu hiển thị trên mobile.
- Triển khai một số biện pháp bảo mật: phân quyền file, **reCAPTCHA**, giới hạn tần suất đăng nhập.`,
  },
  {
    ...PROJECTS_EN[2],
    title: "Tiem Tour",
    description: `Website đặt tour cho phép người dùng tìm kiếm và lọc tour theo điểm đến, ngày, thời lượng và giá.
Hỗ trợ yêu cầu tour tuỳ chỉnh giúp người dùng cá nhân hoá lịch trình theo nhu cầu. Nền tảng cung cấp tình trạng chỗ và giá theo thời gian thực, đảm bảo trải nghiệm đặt tour mượt và trực quan.
- Dựng base dự án, UI và animation theo thiết kế.
- Tạo Custom Post Type và ACF để xây dựng REST API từ WordPress, phục vụ dữ liệu cho giao diện Next.js.
- Tích hợp thanh toán (OnePay) và form gửi thông tin cho admin và người dùng.`,
  },
  {
    ...PROJECTS_EN[3],
    title: "Zio Hair",
    description: `Nền tảng online cho phép khách hàng đăng ký, đăng nhập và đặt lịch salon bằng cách chọn ngày, giờ và stylist. Người dùng có thể xem dịch vụ và sản phẩm chăm sóc tóc, thêm vào giỏ hàng và thanh toán online.
- Quản lý đăng ký, đăng nhập và tài khoản người dùng.
- Triển khai tính năng đặt lịch theo ngày, giờ và stylist.
- Xây dựng giỏ hàng cho dịch vụ và sản phẩm chăm sóc tóc.
- Tích hợp thanh toán online và thông báo xác nhận đặt lịch.
- Xây dựng trang quản trị để quản lý lịch hẹn, dịch vụ và sản phẩm.`,
  },
  {
    ...PROJECTS_EN[4],
    title: "Lotus Charm Travel",
    description: `Nền tảng đặt tour cá nhân hoá cho phép tìm kiếm và lọc tour theo điểm đến, ngày, thời lượng và ngân sách. Hệ thống hỗ trợ yêu cầu tour tuỳ chỉnh, giúp du khách thiết kế lịch trình theo sở thích. Website có hỗ trợ đa ngôn ngữ (Anh, Trung) và hiển thị tình trạng chỗ theo thời gian thực, mang lại trải nghiệm đặt tour mượt mà, thân thiện.
- Xây dựng base dự án, UI responsive và animation mượt theo thiết kế (Figma).
- Tạo Custom Post Types và ACF fields trong WordPress để expose dữ liệu qua REST API cho frontend Next.js.
- Triển khai lọc tour theo điểm đến, thời lượng, ngày và giá.
- Tích hợp cổng thanh toán (Megapay) và form booking cho admin và người dùng.
- Tối ưu hiệu năng (PageSpeed Insights, lazy loading, tối ưu hình ảnh, code splitting).
- Đảm bảo best practices SEO và chức năng đa ngôn ngữ cho khách quốc tế.`,
  },
]

// Backward-compatible export (current site defaults to English).
export const PROJECTS = PROJECTS_EN

export type PortfolioLocale = "en" | "vi"

export function getProjectsByLocale(locale: PortfolioLocale): Project[] {
  return locale === "vi" ? PROJECTS_VI : PROJECTS_EN
}
