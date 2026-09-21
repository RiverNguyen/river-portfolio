import dynamic from "next/dynamic"

import { ScrollToHash } from "@/components/scroll-to-hash"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

const AiChat = dynamic(() =>
  import("@/features/chatbot/components/ai-chat").then((mod) => mod.AiChat)
)

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToHash />
      <SiteHeader />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter />
      <AiChat />
    </>
  )
}
