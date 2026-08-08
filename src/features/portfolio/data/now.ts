export type NowItem = {
  /** Short category label, e.g. Building / Learning */
  label: string
  title: string
  href?: string
  note?: string
}

export type NowData = {
  updatedAt: string
  items: NowItem[]
}

export const NOW_EN: NowData = {
  updatedAt: "2026-08-08",
  items: [
    {
      label: "Building",
      title: "This portfolio — polish, motion, and bilingual UX",
      href: "/",
      note: "Shipping small, sharp details",
    },
    {
      label: "Shipping",
      title: "Client frontends with Next.js + TypeScript",
      note: "Brand sites & product UIs at Bateco",
    },
    {
      label: "Learning",
      title: "Deeper React Server Components patterns",
      note: "Caching, streaming, and composition",
    },
    {
      label: "Exploring",
      title: "Tasteful micro-interactions without the noise",
      note: "Motion that earns its place",
    },
  ],
}

export const NOW_VI: NowData = {
  updatedAt: "2026-08-08",
  items: [
    {
      label: "Đang làm",
      title: "Portfolio này — tinh chỉnh, motion và UX song ngữ",
      href: "/",
      note: "Ship từng chi tiết nhỏ nhưng sắc",
    },
    {
      label: "Đang ship",
      title: "Frontend khách hàng với Next.js + TypeScript",
      note: "Brand site & UI sản phẩm tại Bateco",
    },
    {
      label: "Đang học",
      title: "React Server Components sâu hơn",
      note: "Caching, streaming và composition",
    },
    {
      label: "Đang khám phá",
      title: "Micro-interaction đúng chỗ, không ồn",
      note: "Motion phải đáng có mặt",
    },
  ],
}

export function getNowByLocale(locale: "en" | "vi"): NowData {
  return locale === "vi" ? NOW_VI : NOW_EN
}
