import type { MetadataRoute } from "next"

import { SITE_INFO } from "@/config/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "River",
    name: SITE_INFO.name,
    description: SITE_INFO.description,
    icons: [
      {
        src: "/logo.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
        purpose: "any",
      },
    ],
    id: "/?utm_source=pwa",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    scope: "/",
  }
}
