"use client"

import { AppProgressProvider } from "@bprogress/next"
import { Provider as JotaiProvider } from "jotai"
import { ThemeProvider } from "next-themes"

import { PixelModeListener } from "./pixel-mode-listener"
import { TooltipProvider } from "./base/ui/tooltip"
import { Toaster } from "./ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeProvider
        enableSystem
        disableTransitionOnChange
        enableColorScheme
        storageKey="theme"
        defaultTheme="system"
        attribute="class"
      >
        <AppProgressProvider
          color="var(--foreground)"
          height="2px"
          delay={500}
          options={{ showSpinner: false }}
        >
          <TooltipProvider>{children}</TooltipProvider>
        </AppProgressProvider>

        <PixelModeListener />
        <Toaster position="top-center" />
      </ThemeProvider>
    </JotaiProvider>
  )
}
