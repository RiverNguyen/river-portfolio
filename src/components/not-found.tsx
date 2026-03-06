import { ArrowRightIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

export async function NotFound({ className }: { className?: string }) {
  const t = await getTranslations("Common")

  return (
    <div
      className={cn(
        "flex h-[calc(100svh-5.5rem)] flex-col items-center justify-center",
        className
      )}
    >
      <h1 className="my-6 text-8xl font-medium tracking-tighter tabular-nums">
        404
      </h1>

      <Button variant="default" asChild>
        <Link href="/">
          {t("goHome")}
          <ArrowRightIcon />
        </Link>
      </Button>
    </div>
  )
}
