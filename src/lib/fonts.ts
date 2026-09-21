import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import localFont from "next/font/local"

export const fontSans = GeistSans
export const fontMono = GeistMono

// Import only Square. The geist/font/pixel barrel registers all five pixel
// faces, and next/font preloads every face it registers.
export const fontPixelSquare = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Square.woff2",
  variable: "--font-geist-pixel-square",
  weight: "500",
  display: "swap",
  adjustFontFallback: false,
  fallback: [
    "Geist Mono",
    "ui-monospace",
    "SFMono-Regular",
    "Roboto Mono",
    "Menlo",
    "monospace",
  ],
})
