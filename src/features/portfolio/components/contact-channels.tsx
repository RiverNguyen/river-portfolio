import { MapPinIcon } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { getUserByLocale } from "@/features/portfolio/data/user"
import { cn } from "@/lib/utils"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"
import { CurrentLocalTimeItem } from "./overview/current-local-time-item"
import { EmailItem } from "./overview/email-item"
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./overview/intro-item"
import { PhoneItem } from "./overview/phone-item"

export async function ContactChannels() {
  const locale = await getLocale()
  const t = await getTranslations("Contact")
  const user = getUserByLocale(locale === "vi" ? "vi" : "en")

  return (
    <Panel className="relative border-x-0">
      <PanelHeader>
        <PanelTitle className="text-xl sm:text-2xl">
          {t("channelsTitle")}
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="space-y-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {t("channelsDescription")}
        </p>

        <div
          className={cn(
            "relative grid gap-x-4 gap-y-2.5 sm:grid-cols-2",
            "before:absolute before:-top-4 before:-right-4 before:w-[calc(50%+var(--spacing)*6)] before:border-t before:border-edge/50 max-sm:before:content-none"
          )}
        >
          <EmailItem email={user.email} />
          <PhoneItem phoneNumber={user.phoneNumber} />

          <IntroItem>
            <IntroItemIcon>
              <MapPinIcon />
            </IntroItemIcon>
            <IntroItemContent>
              <IntroItemLink
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(user.address)}`}
                aria-label={`Location: ${user.address}`}
              >
                {user.address}
              </IntroItemLink>
            </IntroItemContent>
          </IntroItem>

          <CurrentLocalTimeItem timeZone={user.timeZone} />
        </div>

        <p className="border-t border-edge pt-4 font-mono text-xs text-muted-foreground">
          {t("responseTime")}
        </p>
      </PanelContent>

      <div className="absolute top-0 left-[calc(50%-var(--spacing)*2-1px)] -z-1 h-full border-r border-edge/50 max-sm:hidden" />
    </Panel>
  )
}
