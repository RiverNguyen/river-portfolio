import {
  getProjectsByLocale,
  type PortfolioLocale,
  PROJECTS_EN,
} from "./projects"

export type CaseStudySection = {
  title: string
  body: string
}

export type CaseStudyMetric = {
  value: string
  label: string
  note?: string
}

export type CaseStudy = {
  slug: string
  projectId: string
  title: string
  tagline: string
  role: string
  period: string
  liveUrl: string
  coverImage: string
  images: string[]
  skills: string[]
  summary: string
  sections: CaseStudySection[]
  metrics: CaseStudyMetric[]
  outcomes: string[]
}

type CaseStudyCopy = {
  title?: string
  tagline: string
  role: string
  summary: string
  sections: CaseStudySection[]
  outcomes: string[]
}

type MetricSource = {
  value: string
  label: { en: string; vi: string }
  note?: { en: string; vi: string }
}

/** Shared shipping / lab metrics — values stay locale-agnostic. */
const CASE_METRICS: Record<string, MetricSource[]> = {
  "tiem-tour": [
    {
      value: "1.4s",
      label: { en: "LCP", vi: "LCP" },
      note: { en: "Mobile lab", vi: "Lab mobile" },
    },
    {
      value: "96",
      label: { en: "Performance", vi: "Performance" },
      note: { en: "Lighthouse", vi: "Lighthouse" },
    },
    {
      value: "4",
      label: { en: "Live filters", vi: "Bộ lọc live" },
      note: { en: "Destination → price", vi: "Điểm đến → giá" },
    },
    {
      value: "1",
      label: { en: "Checkout rail", vi: "Luồng thanh toán" },
      note: { en: "OnePay wired", vi: "OnePay" },
    },
  ],
  "inno-jsc": [
    {
      value: "95",
      label: { en: "Performance", vi: "Performance" },
      note: { en: "Lighthouse", vi: "Lighthouse" },
    },
    {
      value: "1.6s",
      label: { en: "LCP", vi: "LCP" },
      note: { en: "Mobile lab", vi: "Lab mobile" },
    },
    {
      value: "8",
      label: { en: "Page sections", vi: "Section trang" },
      note: { en: "Clear narrative", vi: "Narrative rõ" },
    },
    {
      value: "1",
      label: { en: "Design system", vi: "Design system" },
      note: { en: "Reusable UI", vi: "UI tái sử dụng" },
    },
  ],
  "ama-corp": [
    {
      value: "94",
      label: { en: "Performance", vi: "Performance" },
      note: { en: "Lighthouse", vi: "Lighthouse" },
    },
    {
      value: "1.7s",
      label: { en: "LCP", vi: "LCP" },
      note: { en: "Mobile lab", vi: "Lab mobile" },
    },
    {
      value: "100%",
      label: { en: "Responsive", vi: "Responsive" },
      note: { en: "Phone → desktop", vi: "Phone → desktop" },
    },
    {
      value: "SEO",
      label: { en: "Structure", vi: "Cấu trúc" },
      note: { en: "Crawl-friendly", vi: "Thân thiện SEO" },
    },
  ],
  "okhub-agency": [
    {
      value: "97",
      label: { en: "Performance", vi: "Performance" },
      note: { en: "Lighthouse", vi: "Lighthouse" },
    },
    {
      value: "1.3s",
      label: { en: "LCP", vi: "LCP" },
      note: { en: "Mobile lab", vi: "Lab mobile" },
    },
    {
      value: "12+",
      label: { en: "Case tiles", vi: "Ô case study" },
      note: { en: "Work showcase", vi: "Showcase dự án" },
    },
    {
      value: "GSAP",
      label: { en: "Motion layer", vi: "Lớp motion" },
      note: { en: "Scroll storytelling", vi: "Scroll storytelling" },
    },
  ],
  antho: [
    {
      value: "93",
      label: { en: "Performance", vi: "Performance" },
      note: { en: "Lighthouse", vi: "Lighthouse" },
    },
    {
      value: "1.8s",
      label: { en: "LCP", vi: "LCP" },
      note: { en: "Mobile lab", vi: "Lab mobile" },
    },
    {
      value: "CPT",
      label: { en: "Content model", vi: "Content model" },
      note: { en: "ACF + REST", vi: "ACF + REST" },
    },
    {
      value: "Headless",
      label: { en: "Architecture", vi: "Kiến trúc" },
      note: { en: "WP → Next.js", vi: "WP → Next.js" },
    },
  ],
  "zio-hair": [
    {
      value: "3",
      label: { en: "Booking steps", vi: "Bước đặt lịch" },
      note: { en: "Date → pay", vi: "Ngày → thanh toán" },
    },
    {
      value: "2",
      label: { en: "Commerce rails", vi: "Luồng bán hàng" },
      note: { en: "Services + retail", vi: "Dịch vụ + bán lẻ" },
    },
    {
      value: "1.5s",
      label: { en: "LCP", vi: "LCP" },
      note: { en: "Mobile lab", vi: "Lab mobile" },
    },
    {
      value: "Admin",
      label: { en: "Ops surface", vi: "Bảng vận hành" },
      note: { en: "Appointments + SKUs", vi: "Lịch + sản phẩm" },
    },
  ],
  "lotus-charm-travel": [
    {
      value: "EN/ZH",
      label: { en: "Locales", vi: "Ngôn ngữ" },
      note: { en: "International guests", vi: "Khách quốc tế" },
    },
    {
      value: "4",
      label: { en: "Tour filters", vi: "Bộ lọc tour" },
      note: { en: "Incl. budget", vi: "Kèm ngân sách" },
    },
    {
      value: "1.5s",
      label: { en: "LCP", vi: "LCP" },
      note: { en: "Mobile lab", vi: "Lab mobile" },
    },
    {
      value: "Megapay",
      label: { en: "Checkout", vi: "Checkout" },
      note: { en: "Payment wired", vi: "Đã nối thanh toán" },
    },
  ],
  "avian-odyssey": [
    {
      value: "95",
      label: { en: "Performance", vi: "Performance" },
      note: { en: "Lighthouse", vi: "Lighthouse" },
    },
    {
      value: "1.4s",
      label: { en: "LCP", vi: "LCP" },
      note: { en: "Mobile lab", vi: "Lab mobile" },
    },
    {
      value: "Immersive",
      label: { en: "Scroll story", vi: "Scroll story" },
      note: { en: "GSAP + Swiper", vi: "GSAP + Swiper" },
    },
    {
      value: "CMS",
      label: { en: "Editable", vi: "Editable" },
      note: { en: "Ops-friendly", vi: "Dễ vận hành" },
    },
  ],
  homesworld: [
    {
      value: "4",
      label: { en: "Island combos", vi: "Combo đảo" },
      note: { en: "Primary SKU", vi: "SKU chính" },
    },
    {
      value: "Map",
      label: { en: "Decision aids", vi: "Hỗ trợ quyết định" },
      note: { en: "Map + weather", vi: "Bản đồ + thời tiết" },
    },
    {
      value: "1.6s",
      label: { en: "LCP", vi: "LCP" },
      note: { en: "Mobile lab", vi: "Lab mobile" },
    },
    {
      value: "94",
      label: { en: "Performance", vi: "Performance" },
      note: { en: "Lighthouse", vi: "Lighthouse" },
    },
  ],
  vova: [
    {
      value: "Hero",
      label: { en: "Brand entry", vi: "Lối vào brand" },
      note: { en: "Cinematic", vi: "Cinematic" },
    },
    {
      value: "3",
      label: { en: "Hub formats", vi: "Định dạng hub" },
      note: { en: "Article · podcast · video", vi: "Bài · podcast · video" },
    },
    {
      value: "1.7s",
      label: { en: "LCP", vi: "LCP" },
      note: { en: "Mobile lab", vi: "Lab mobile" },
    },
    {
      value: "92",
      label: { en: "Performance", vi: "Performance" },
      note: { en: "Media-heavy", vi: "Nặng media" },
    },
  ],
}

const COPY_EN: Record<string, CaseStudyCopy> = {
  "tiem-tour": {
    tagline:
      "Tour search, filters, and custom itineraries — built to book without friction.",
    role: "Frontend Developer",
    summary:
      "Tiem Tour is a tour booking site for travelers exploring Ha Giang and nearby routes. Guests need to find trips fast, filter by real constraints, request custom itineraries, and pay with confidence — mostly on mobile.",
    sections: [
      {
        title: "The problem",
        body: `Tour operators often juggle Facebook inbox, spreadsheets, and a brochure-style site. Travelers bounce when they can't answer three questions quickly: **where can I go, when is it available, and how do I book?**

Tiem Tour needed a customer-facing experience that felt modern, while ops still managed content in a familiar CMS.`,
      },
      {
        title: "Approach",
        body: `I built a **Next.js** frontend on top of **WordPress** as a headless CMS:

- Custom post types + **ACF** for tours, pricing fields, and availability metadata
- **REST API** feeding listing, detail, and filter UIs
- Booking + inquiry forms with admin notifications
- **OnePay** for payment checkout`,
      },
      {
        title: "Key decisions",
        body: `- **Filters first:** destination, date, duration, and price — the real decision drivers
- **Custom tour requests:** a dedicated flow for trips that don't fit fixed packages
- **WordPress for ops, Next.js for guests:** admin comfort without a sluggish theme for customers
- **Motion with restraint:** GSAP/Swiper where they clarify hierarchy`,
      },
    ],
    outcomes: [
      "Complete browse → filter → book/request loop on mobile and desktop",
      "Ops update tours in WordPress without touching the frontend",
      "Payment and inquiry paths wired for admin follow-up",
      "Reusable headless booking pattern for later travel projects",
    ],
  },
  "inno-jsc": {
    tagline:
      "Corporate presence for Inno JSC — values, services, and credibility in one scroll.",
    role: "Frontend Developer",
    summary:
      "Inno needed a corporate website that introduces products, services, and achievements with a professional brand feel and room for marketing to iterate quickly.",
    sections: [
      {
        title: "The problem",
        body: `Many company sites bury the value proposition under dense copy. Inno needed a clear narrative: who they are, what they offer, and why it matters — without feeling like a PDF converted to HTML.`,
      },
      {
        title: "Approach",
        body: `- Multi-section landing built in **Next.js**
- Responsive UI + scroll/animation for a polished corporate tone
- SEO and performance basics for marketing traffic
- Fast content/visual iteration with the marketing team`,
      },
      {
        title: "Key decisions",
        body: `- Lead with **services and proof**, not generic hero slogans
- Motion as punctuation — section reveals, not continuous noise
- Shared component patterns so future pages stay consistent`,
      },
    ],
    outcomes: [
      "A coherent corporate landing with clear service storytelling",
      "Smooth responsive experience across breakpoints",
      "Performance/SEO foundations for ongoing campaigns",
    ],
  },
  "ama-corp": {
    tagline:
      "Corporate site with secure access — brand presence plus authenticated user flows.",
    role: "Frontend Developer",
    summary:
      "AMA Corp needed more than a brochure: a professional brand site with authentication and OAuth so the right users can access protected areas securely.",
    sections: [
      {
        title: "The problem",
        body: `Public marketing pages and private access often live in separate systems. AMA needed both: a credible public face and authenticated entry without fracturing the brand.`,
      },
      {
        title: "Approach",
        body: `- Next.js project base from Figma with responsive UI and motion
- Authentication + **OAuth** for secure access
- Content/SEO structure for marketing campaigns
- Collaboration loops with marketing for content velocity`,
      },
      {
        title: "Key decisions",
        body: `- Treat auth as part of the product UX, not a bolted-on portal
- Keep public and private surfaces visually consistent
- Prefer clear error/empty states over silent auth failures`,
      },
    ],
    outcomes: [
      "Public brand site with professional motion and layout",
      "OAuth/auth flows integrated for secure access",
      "Campaign-friendly content structure",
    ],
  },
  "okhub-agency": {
    tagline:
      "Agency site stack — Next.js frontends, WordPress content, and production hardening.",
    role: "Frontend Developer",
    summary:
      "OKHub Agency work spanned headless WordPress + Next.js delivery: custom themes, CPT/ACF APIs, animation, payments/booking patterns, and practical security measures.",
    sections: [
      {
        title: "The problem",
        body: `Agency projects demand speed **and** durability: clients need editable content, interactive frontends, and baseline security without reinventing the stack every time.`,
      },
      {
        title: "Approach",
        body: `- Responsive **Next.js / React** apps
- Custom **WordPress** themes tuned for performance, SEO, accessibility
- CPT + **ACF** exposed through REST for headless UIs
- GSAP motion, state via Redux/Zustand/Context where needed
- Payment/booking integrations and hardening (permissions, reCAPTCHA, rate limits)`,
      },
      {
        title: "Key decisions",
        body: `- Standardize headless contracts early so UI and CMS don't drift
- Optimize media and code-splitting as defaults, not afterthoughts
- Ship security basics with every form-heavy surface`,
      },
    ],
    outcomes: [
      "Reusable WordPress → Next.js delivery pattern",
      "Interactive, SEO-aware frontends with smooth motion",
      "Booking/payment-ready flows with practical safeguards",
    ],
  },
  antho: {
    title: "An Tho IC",
    tagline:
      "Corporate + commerce-ready presence for An Tho IC on a headless stack.",
    role: "Frontend Developer",
    summary:
      "An Tho IC needed a site that presents products and services while supporting dynamic content and commerce-related flows through WordPress + Next.js.",
    sections: [
      {
        title: "The problem",
        body: `Industrial/corporate brands often need catalog-like clarity with marketing polish. Content teams also need to publish without waiting on deploys.`,
      },
      {
        title: "Approach",
        body: `- Next.js frontend with responsive UI
- WordPress CPT/ACF + REST for structured content
- GSAP motion, SEO/performance practices
- Payment/booking form patterns and baseline security`,
      },
      {
        title: "Key decisions",
        body: `- Model content types around real business entities, not page blobs
- Keep animation secondary to scannability
- Reuse proven headless patterns from other client work`,
      },
    ],
    outcomes: [
      "Structured content model feeding a modern frontend",
      "Responsive, animated company presence",
      "Commerce/booking-ready integrations where needed",
    ],
  },
  "zio-hair": {
    tagline:
      "Salon booking + retail in one flow — pick stylist, time, products, pay online.",
    role: "Frontend Developer",
    summary:
      "Zio Hair combines appointment booking (date, time, stylist) with a product cart and online payment — a dual-purpose platform for salon services and retail.",
    sections: [
      {
        title: "The problem",
        body: `Salons lose bookings to phone tag and no-shows. Selling products separately from appointments also splits the customer journey. Zio needed one place to book **and** buy.`,
      },
      {
        title: "Approach",
        body: `- Auth: registration, login, account management
- Booking by date, time, and stylist
- Cart for services + hair-care products
- Online payment and confirmation notifications
- Admin dashboard for appointments, services, and products`,
      },
      {
        title: "Key decisions",
        body: `- Validate availability before payment to reduce failed checkouts
- Keep booking steps obvious on mobile
- Give admin tools equal priority — ops pain becomes customer pain`,
      },
    ],
    outcomes: [
      "End-to-end booking + cart + payment journey",
      "Admin surfaces for day-to-day salon operations",
      "Clearer confirmation path for customers",
    ],
  },
  "lotus-charm-travel": {
    tagline:
      "Multilingual tour booking for international travelers — filter, request, pay.",
    role: "Frontend Developer",
    summary:
      "Lotus Charm Travel is a personalized tour platform with destination/date/duration/budget filters, custom tour requests, Megapay checkout, and EN/ZH support for international guests.",
    sections: [
      {
        title: "The problem",
        body: `International travelers need confidence in language, pricing, and availability. A brochure site can't carry filters, custom requests, and payment without a real product architecture.`,
      },
      {
        title: "Approach",
        body: `- Next.js UI from Figma with motion
- Headless WordPress CPT/ACF → REST
- Tour filters + custom request flows
- **Megapay** payment + booking forms
- Performance (CWV-minded) and multilingual support`,
      },
      {
        title: "Key decisions",
        body: `- Multilingual as a product requirement, not a plugin afterthought
- Reuse the Tiem Tour booking lessons with payment gateway differences
- Optimize for mobile networks common to traveling users`,
      },
    ],
    outcomes: [
      "Filterable tour discovery with custom request support",
      "Megapay-integrated booking path",
      "EN/ZH experience with stronger performance baselines",
    ],
  },
  homesworld: {
    tagline:
      "Island combo booking — hotels, transport, maps, and weather in one plan.",
    role: "Frontend Developer",
    summary:
      "HomesWorld helps travelers book Vietnamese island combos (Cô Tô, Cát Bà, Quan Lạn, Minh Châu) with lodging + transport, interactive maps, filters, room details, and destination weather.",
    sections: [
      {
        title: "The problem",
        body: `Island trips involve more than a hotel SKU — transport, weather, and geography matter. Guests need to compare combos without assembling the trip from five tabs.`,
      },
      {
        title: "Approach",
        body: `- Next.js + Tailwind UI from Figma
- WordPress CPT/ACF → REST for combo content
- Filtering, room/booking detail pages, interactive destination map
- Destination weather widget
- GSAP/Swiper for smooth exploration UX`,
      },
      {
        title: "Key decisions",
        body: `- Treat **combo** as the primary product, not isolated rooms
- Map + weather as decision aids, not decorative widgets
- Keep detail pages scannable on mobile before checkout`,
      },
    ],
    outcomes: [
      "Combo discovery with map and weather context",
      "Headless content model for destinations and packages",
      "Polished motion without sacrificing performance",
    ],
  },
  "avian-odyssey": {
    tagline:
      "A premium Indochina travel brand site — guides, resorts, and curated tours.",
    role: "Frontend Developer",
    summary:
      "Avian Odyssey is a bespoke travel brand experience: destination guides, a signature hotels & resorts collection, curated tours, and inspiration pages with a premium feel.",
    sections: [
      {
        title: "The problem",
        body: `Luxury travel brands live or die on atmosphere. The site had to feel editorial and exclusive while remaining easy to browse across destinations and properties.`,
      },
      {
        title: "Approach",
        body: `- WordPress build from Figma with responsive, premium layouts
- Structured content for guides, resorts, and tours
- GSAP/Swiper transitions and scroll storytelling
- Image/performance optimization for media-heavy pages`,
      },
      {
        title: "Key decisions",
        body: `- Content architecture first — discovery depends on structure
- Motion supports brand mood, never blocks reading
- Optimize imagery aggressively for storytelling pages`,
      },
    ],
    outcomes: [
      "Cohesive premium brand presence",
      "Browsable guides and resort collections",
      "Fast, cinematic pages across devices",
    ],
  },
  vova: {
    tagline:
      "AI product storytelling — cinematic hero, manifesto, and knowledge hub.",
    role: "Frontend Developer",
    summary:
      "Vova (Netten) is an AI & Creativity brand site with a space-themed immersive hero, company manifesto, and a knowledge hub of articles, podcasts, and videos.",
    sections: [
      {
        title: "The problem",
        body: `AI products need narrative, not just feature lists. Vova needed a brand surface that feels inventive while still organizing long-form knowledge content.`,
      },
      {
        title: "Approach",
        body: `- WordPress from Figma with cinematic hero
- ACF-driven manifesto + knowledge hub (articles, podcasts, videos)
- Immersive GSAP/Swiper storytelling
- Media performance work so the hero doesn't punish mobile`,
      },
      {
        title: "Key decisions",
        body: `- Separate **brand spectacle** from **knowledge utility** without breaking tone
- Let ACF own content flexibility for the hub
- Budget performance for hero media from day one`,
      },
    ],
    outcomes: [
      "Memorable space-themed brand entry",
      "Editable manifesto and knowledge hub",
      "Story-driven motion with usable performance",
    ],
  },
}

const COPY_VI: Record<string, CaseStudyCopy> = {
  "tiem-tour": {
    title: "Tiệm Tour",
    tagline:
      "Tìm tour, lọc theo nhu cầu và yêu cầu lịch trình riêng — đặt chỗ không ma sát.",
    role: "Lập trình viên Frontend",
    summary:
      "Tiệm Tour là website đặt tour cho khách khám phá Hà Giang và cung đường lân cận. Khách cần tìm chuyến nhanh, lọc theo ràng buộc thật, gửi yêu cầu lịch trình riêng và thanh toán yên tâm — chủ yếu trên mobile.",
    sections: [
      {
        title: "Vấn đề",
        body: `Nhiều đơn vị vẫn xoay quanh inbox Facebook, spreadsheet và website brochure. Khách thoát khi không trả lời nhanh: **đi đâu được, còn chỗ khi nào, đặt thế nào?**

Cần trải nghiệm phía khách hiện đại, trong khi ops vẫn quản lý nội dung trên CMS quen thuộc.`,
      },
      {
        title: "Hướng tiếp cận",
        body: `- Frontend **Next.js** trên **WordPress** headless
- CPT + **ACF** cho tour, giá, metadata
- **REST API** nuôi listing/detail/filter
- Form đặt tour/inquiry + **OnePay**`,
      },
      {
        title: "Quyết định quan trọng",
        body: `- Ưu tiên bộ lọc thật: điểm đến, ngày, thời lượng, giá
- Flow yêu cầu tour tuỳ chỉnh riêng
- WordPress cho ops, Next.js cho khách
- Motion có kiềm chế`,
      },
    ],
    outcomes: [
      "Vòng browse → lọc → đặt/yêu cầu hoàn chỉnh",
      "Ops cập nhật tour trong WordPress không đụng frontend",
      "Luồng thanh toán và inquiry nối follow-up admin",
      "Pattern booking headless tái dùng được",
    ],
  },
  "inno-jsc": {
    title: "Công ty Cổ phần Inno",
    tagline:
      "Hiện diện doanh nghiệp cho Inno — giá trị, dịch vụ và uy tín trong một dòng kể.",
    role: "Lập trình viên Frontend",
    summary:
      "Inno cần website giới thiệu sản phẩm, dịch vụ và thành tựu với cảm giác chuyên nghiệp, đồng thời để marketing cập nhật nhanh.",
    sections: [
      {
        title: "Vấn đề",
        body: `Nhiều site công ty làm chìm value proposition dưới copy dày. Inno cần narrative rõ: là ai, làm gì, vì sao đáng tin.`,
      },
      {
        title: "Hướng tiếp cận",
        body: `- Landing nhiều section bằng **Next.js**
- UI responsive + scroll/animation
- Nền tảng SEO/hiệu năng
- Vòng lặp cập nhật với marketing`,
      },
      {
        title: "Quyết định quan trọng",
        body: `- Lead bằng dịch vụ và proof
- Motion như dấu nhấn, không ồn liên tục
- Pattern component dùng lại cho trang sau`,
      },
    ],
    outcomes: [
      "Landing doanh nghiệp mạch lạc",
      "Trải nghiệm responsive mượt",
      "Nền tảng cho chiến dịch tiếp theo",
    ],
  },
  "ama-corp": {
    tagline:
      "Website doanh nghiệp có truy cập bảo mật — brand public kèm auth/OAuth.",
    role: "Lập trình viên Frontend",
    summary:
      "AMA Corp cần vừa brochure chuyên nghiệp vừa cổng truy cập có xác thực/OAuth cho đúng đối tượng.",
    sections: [
      {
        title: "Vấn đề",
        body: `Marketing public và khu vực private thường tách hệ thống. AMA cần cả hai mà không vỡ brand.`,
      },
      {
        title: "Hướng tiếp cận",
        body: `- Base Next.js từ Figma, UI + motion
- Auth + **OAuth**
- Cấu trúc nội dung/SEO cho campaign
- Phối hợp marketing`,
      },
      {
        title: "Quyết định quan trọng",
        body: `- Auth là một phần UX sản phẩm
- Public/private cùng ngôn ngữ hình ảnh
- Empty/error state rõ ràng khi auth fail`,
      },
    ],
    outcomes: [
      "Brand site chuyên nghiệp",
      "Luồng auth/OAuth tích hợp",
      "Cấu trúc nội dung phục vụ campaign",
    ],
  },
  "okhub-agency": {
    tagline:
      "Stack agency — frontend Next.js, nội dung WordPress, và hardening khi ship.",
    role: "Lập trình viên Frontend",
    summary:
      "Công việc OKHub trải dài headless WordPress + Next.js: theme, CPT/ACF API, animation, payment/booking và biện pháp bảo mật thực dụng.",
    sections: [
      {
        title: "Vấn đề",
        body: `Dự án agency cần nhanh và bền: nội dung sửa được, frontend tương tác, bảo mật tối thiểu — không reinvent stack mỗi lần.`,
      },
      {
        title: "Hướng tiếp cận",
        body: `- App **Next.js/React** responsive
- Theme **WordPress** tối ưu performance/SEO/a11y
- CPT + **ACF** → REST cho UI headless
- GSAP, state Redux/Zustand/Context
- Payment/booking + hardening (permissions, reCAPTCHA, rate limit)`,
      },
      {
        title: "Quyết định quan trọng",
        body: `- Chốt contract headless sớm
- Tối ưu media/code-splitting mặc định
- Security cơ bản đi cùng mọi form`,
      },
    ],
    outcomes: [
      "Pattern WordPress → Next.js tái dùng",
      "Frontend tương tác, thân thiện SEO",
      "Flow booking/payment có lớp bảo vệ",
    ],
  },
  antho: {
    title: "An Thọ IC",
    tagline:
      "Hiện diện doanh nghiệp sẵn sàng commerce trên stack headless cho An Thọ IC.",
    role: "Lập trình viên Frontend",
    summary:
      "An Thọ IC cần site giới thiệu sản phẩm/dịch vụ, nội dung động và các flow liên quan commerce qua WordPress + Next.js.",
    sections: [
      {
        title: "Vấn đề",
        body: `Thương hiệu công nghiệp/corporate cần rõ catalog và vẫn polish marketing. Team nội dung cần publish không chờ deploy.`,
      },
      {
        title: "Hướng tiếp cận",
        body: `- Frontend Next.js responsive
- WordPress CPT/ACF + REST
- GSAP, SEO/performance
- Form payment/booking và security cơ bản`,
      },
      {
        title: "Quyết định quan trọng",
        body: `- Model nội dung theo thực thể nghiệp vụ
- Animation không át khả năng scan
- Tái dùng pattern headless đã chứng minh`,
      },
    ],
    outcomes: [
      "Mô hình nội dung nuôi frontend hiện đại",
      "Hiện diện công ty responsive có motion",
      "Sẵn sàng tích hợp commerce/booking",
    ],
  },
  "zio-hair": {
    tagline:
      "Đặt lịch salon + bán sản phẩm một mạch — chọn stylist, giờ, giỏ hàng, thanh toán.",
    role: "Lập trình viên Frontend",
    summary:
      "Zio Hair gộp đặt lịch (ngày, giờ, stylist) với giỏ dịch vụ/sản phẩm và thanh toán online — một nền tảng cho salon và retail.",
    sections: [
      {
        title: "Vấn đề",
        body: `Salon mất booking vì gọi điện qua lại. Bán sản phẩm tách khỏi lịch hẹn làm gãy hành trình. Zio cần một chỗ vừa đặt vừa mua.`,
      },
      {
        title: "Hướng tiếp cận",
        body: `- Auth đăng ký/đăng nhập/tài khoản
- Booking theo ngày, giờ, stylist
- Cart dịch vụ + sản phẩm
- Thanh toán online + thông báo
- Admin quản lý lịch, dịch vụ, sản phẩm`,
      },
      {
        title: "Quyết định quan trọng",
        body: `- Validate chỗ trống trước payment
- Bước booking rõ trên mobile
- Admin tool được ưu tiên ngang khách`,
      },
    ],
    outcomes: [
      "Hành trình booking + cart + payment",
      "Admin phục vụ vận hành salon",
      "Xác nhận rõ ràng cho khách",
    ],
  },
  "lotus-charm-travel": {
    tagline:
      "Đặt tour đa ngôn ngữ cho khách quốc tế — lọc, yêu cầu riêng, thanh toán.",
    role: "Lập trình viên Frontend",
    summary:
      "Lotus Charm Travel là nền tảng tour cá nhân hoá với lọc điểm đến/ngày/thời lượng/ngân sách, yêu cầu tour riêng, Megapay và hỗ trợ EN/ZH.",
    sections: [
      {
        title: "Vấn đề",
        body: `Khách quốc tế cần tin vào ngôn ngữ, giá và chỗ trống. Brochure site không gánh nổi filter, custom request và payment.`,
      },
      {
        title: "Hướng tiếp cận",
        body: `- UI Next.js từ Figma + motion
- WordPress headless CPT/ACF → REST
- Filter tour + custom request
- **Megapay** + form booking
- Performance và đa ngôn ngữ`,
      },
      {
        title: "Quyết định quan trọng",
        body: `- Đa ngôn ngữ là requirement sản phẩm
- Tái dụng bài học Tiệm Tour, đổi cổng thanh toán
- Tối ưu cho mạng mobile khi đi tour`,
      },
    ],
    outcomes: [
      "Khám phá tour có filter và custom request",
      "Booking gắn Megapay",
      "Trải nghiệm EN/ZH với nền tảng hiệu năng tốt hơn",
    ],
  },
  homesworld: {
    tagline:
      "Đặt combo đảo — khách sạn, di chuyển, bản đồ và thời tiết trong một kế hoạch.",
    role: "Lập trình viên Frontend",
    summary:
      "HomesWorld giúp đặt combo đảo Việt Nam (Cô Tô, Cát Bà, Quan Lạn, Minh Châu) gồm nghỉ dưỡng + di chuyển, bản đồ tương tác, lọc, chi tiết phòng và widget thời tiết.",
    sections: [
      {
        title: "Vấn đề",
        body: `Chuyến đảo không chỉ là phòng khách sạn — còn di chuyển, thời tiết, địa lý. Khách cần so combo thay vì ghép từ năm tab.`,
      },
      {
        title: "Hướng tiếp cận",
        body: `- Next.js + Tailwind từ Figma
- WordPress CPT/ACF → REST
- Lọc combo, trang chi tiết, bản đồ điểm đến
- Widget thời tiết
- GSAP/Swiper cho UX khám phá`,
      },
      {
        title: "Quyết định quan trọng",
        body: `- **Combo** là sản phẩm chính
- Map + thời tiết là công cụ quyết định
- Trang chi tiết dễ scan trên mobile trước checkout`,
      },
    ],
    outcomes: [
      "Khám phá combo có map và thời tiết",
      "Mô hình nội dung headless cho điểm đến/gói",
      "Motion gọn, hiệu năng ổn",
    ],
  },
  "avian-odyssey": {
    tagline:
      "Brand du lịch Indochina cao cấp — guides, resort và tour biên tập.",
    role: "Lập trình viên Frontend",
    summary:
      "Avian Odyssey là trải nghiệm brand travel: cẩm nang điểm đến, bộ sưu tập hotels & resorts, tour chọn lọc và trang cảm hứng với cảm giác premium.",
    sections: [
      {
        title: "Vấn đề",
        body: `Thương hiệu luxury sống nhờ không khí. Site phải vừa editorial/độc bản vừa dễ duyệt destination và property.`,
      },
      {
        title: "Hướng tiếp cận",
        body: `- WordPress từ Figma, layout premium
- Cấu trúc nội dung guides / resorts / tours
- GSAP/Swiper storytelling
- Tối ưu ảnh và hiệu năng trang media-heavy`,
      },
      {
        title: "Quyết định quan trọng",
        body: `- Architecture nội dung trước — discovery phụ thuộc cấu trúc
- Motion phục vụ mood, không chặn đọc
- Optimize imagery quyết liệt`,
      },
    ],
    outcomes: [
      "Hiện diện brand premium thống nhất",
      "Guides và resort dễ duyệt",
      "Trang cinematic nhưng vẫn nhanh",
    ],
  },
  vova: {
    tagline:
      "Kể chuyện sản phẩm AI — hero cinematic, manifesto và knowledge hub.",
    role: "Lập trình viên Frontend",
    summary:
      "Vova (Netten) là site AI & Creativity với hero chủ đề không gian, manifesto công ty và hub kiến thức (bài viết, podcast, video).",
    sections: [
      {
        title: "Vấn đề",
        body: `Sản phẩm AI cần narrative, không chỉ feature list. Vova cần bề mặt brand sáng tạo nhưng vẫn tổ chức được nội dung dài.`,
      },
      {
        title: "Hướng tiếp cận",
        body: `- WordPress từ Figma với hero cinematic
- ACF cho manifesto + knowledge hub
- Storytelling GSAP/Swiper
- Tối ưu media để hero không “đánh” mobile`,
      },
      {
        title: "Quyết định quan trọng",
        body: `- Tách **brand spectacle** và **knowledge utility** mà không vỡ tone
- ACF giữ linh hoạt nội dung hub
- Chốt ngân sách performance cho hero từ đầu`,
      },
    ],
    outcomes: [
      "Lối vào brand theo chủ đề không gian dễ nhớ",
      "Manifesto và knowledge hub chỉnh sửa được",
      "Motion kể chuyện kèm hiệu năng dùng được",
    ],
  },
}

function formatPeriod(
  start: string,
  end: string | undefined,
  locale: PortfolioLocale
) {
  if (!end) {
    return locale === "vi" ? `${start} — Hiện tại` : `${start} — Present`
  }
  return `${start} — ${end}`
}

function buildCaseStudy(
  projectId: string,
  locale: PortfolioLocale
): CaseStudy | null {
  const project = getProjectsByLocale(locale).find((item) => item.id === projectId)
  const copy = (locale === "vi" ? COPY_VI : COPY_EN)[projectId]
  if (!project || !copy) return null

  return {
    slug: project.id,
    projectId: project.id,
    title: copy.title ?? project.title,
    tagline: copy.tagline,
    role: copy.role,
    period: formatPeriod(project.period.start, project.period.end, locale),
    liveUrl: project.link,
    coverImage: project.images?.[0] ?? project.logo ?? "/image.png",
    images: project.images ?? [],
    skills: project.skills,
    summary: copy.summary,
    sections: copy.sections,
    metrics: (CASE_METRICS[projectId] ?? []).map((metric) => ({
      value: metric.value,
      label: metric.label[locale],
      note: metric.note?.[locale],
    })),
    outcomes: copy.outcomes,
  }
}

export function getCaseStudiesByLocale(locale: PortfolioLocale): CaseStudy[] {
  return PROJECTS_EN.map((project) => buildCaseStudy(project.id, locale)).filter(
    (item): item is CaseStudy => item !== null
  )
}

export function getCaseStudyBySlug(
  slug: string,
  locale: PortfolioLocale = "en"
): CaseStudy | undefined {
  return buildCaseStudy(slug, locale) ?? undefined
}

export function getAllCaseStudySlugs(): string[] {
  return PROJECTS_EN.map((project) => project.id)
}
