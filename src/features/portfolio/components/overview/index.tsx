import {
  LinkIcon,
  MapPinIcon,
  MarsIcon,
  NonBinaryIcon,
  VenusIcon,
} from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { getUserByLocale } from "@/features/portfolio/data/user"
import type { User } from "@/features/portfolio/types/user"
import { cn } from "@/lib/utils"
import { urlToName } from "@/utils/url"

import { Panel, PanelContent } from "../panel"
import { CurrentLocalTimeItem } from "./current-local-time-item"
import { EmailItem } from "./email-item"
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"
import { JobItem } from "./job-item"
import { PhoneItem } from "./phone-item"

export async function Overview() {
  const locale = await getLocale()
  const t = await getTranslations("Portfolio")
  const user = getUserByLocale(locale === "vi" ? "vi" : "en")

  return (
    <Panel>
      <h2 className="sr-only">{t("overview")}</h2>

      <PanelContent className="space-y-2.5">
        {user.jobs.map((job, index) => {
          return (
            <JobItem
              key={index}
              title={job.title}
              company={job.company}
              website={job.website}
            />
          )
        })}

        <div
          className={cn(
            "relative grid gap-x-4 gap-y-2.5 sm:grid-cols-2",
            "before:absolute before:-top-4 before:-right-4 before:w-[calc(50%+var(--spacing)*6)] before:border-t before:border-edge/50 max-sm:before:content-none"
          )}
        >
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

          <PhoneItem phoneNumber={user.phoneNumber} />

          <EmailItem email={user.email} />

          <IntroItem>
            <IntroItemIcon>
              <LinkIcon />
            </IntroItemIcon>
            <IntroItemContent>
              <IntroItemLink
                href={user.website}
                aria-label={`Personal website: ${urlToName(user.website)}`}
              >
                {urlToName(user.website)}
              </IntroItemLink>
            </IntroItemContent>
          </IntroItem>

          <IntroItem>
            <IntroItemIcon>{getGenderIcon(user.gender)}</IntroItemIcon>
            <IntroItemContent aria-label={`Pronouns: ${user.pronouns}`}>
              {user.pronouns}
            </IntroItemContent>
          </IntroItem>
        </div>
      </PanelContent>

      <div className="absolute top-0 left-[calc(50%-var(--spacing)*2-1px)] -z-1 h-full border-r border-edge/50 max-sm:hidden" />
    </Panel>
  )
}

function getGenderIcon(gender: User["gender"]) {
  switch (gender) {
    case "male":
      return <MarsIcon />
    case "female":
      return <VenusIcon />
    case "non-binary":
      return <NonBinaryIcon />
  }
}
