import { MapPinIcon } from "lucide-react"
import Image from "next/image"
import { getLocale, getTranslations } from "next-intl/server"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { UTM_PARAMS } from "@/config/site"
import { getUserByLocale } from "@/features/portfolio/data/user"
import { Link } from "@/i18n/navigation"
import { FlipSentences } from "@/registry/components/flip-sentences"
import { addQueryParams } from "@/utils/url"

import { ProfileMascot } from "./profile-mascot"
import { PronounceMyName } from "./pronounce-my-name"
import { VerifiedIcon } from "./verified-icon"

export async function ProfileHeader() {
  const locale = await getLocale()
  const t = await getTranslations("Portfolio")
  const user = getUserByLocale(locale === "vi" ? "vi" : "en")
  const affiliateUrl = user.affiliateBadge
    ? addQueryParams(user.affiliateBadge.url, UTM_PARAMS)
    : null
  const spokenName = locale === "vi" ? "Nguyễn Đình Giang" : "Nguyen Dinh Giang"
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(user.address)}`

  return (
    <div className="screen-line-after flex border-x border-edge">
      <div className="shrink-0 border-r border-edge">
        <div className="group relative mx-1 my-1 size-24 select-none sm:mx-1.5 sm:my-1.5 sm:size-40">
          <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-background p-[3px] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_12%,transparent)] ring-1 ring-edge transition-[box-shadow,transform] duration-300 ease-out group-hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_22%,transparent),0_12px_32px_-18px_color-mix(in_oklab,var(--foreground)_40%,transparent)] group-hover:ring-foreground/25 sm:p-1">
            <div className="size-full sm:hidden">
              <ProfileMascot size={72} />
            </div>
            <div className="hidden size-full sm:block">
              <ProfileMascot size={132} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center justify-between gap-3 border-b border-edge px-4 py-1.5">
          <a
            className="flex min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            href={mapsUrl}
            target="_blank"
            rel="noopener"
            aria-label={`${t("headerLocation")}: ${user.address}`}
          >
            <MapPinIcon className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{user.address}</span>
          </a>

          <Link
            href="/hire"
            className="flex shrink-0 items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
            aria-label={t("headerOpenToWork")}
          >
            <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500/90" />
            {t("headerOpenToWork")}
          </Link>
        </div>

        <div className="flex items-center gap-2 py-1 pl-4">
          <h1 className="-translate-y-px text-3xl font-semibold tracking-tight">
            {user.displayName}
          </h1>

          <VerifiedIcon
            className="size-4.5 text-info select-none"
            aria-label="Verified"
          />

          <PronounceMyName
            spokenName={spokenName}
            locale={locale === "vi" ? "vi" : "en"}
            namePronunciationUrl={user.namePronunciationUrl || undefined}
          />

          {user.affiliateBadge && affiliateUrl && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    className="relative flex after:absolute after:inset-0 after:rounded-sm after:ring after:ring-black/10 after:ring-inset dark:after:ring-white/15"
                    href={affiliateUrl}
                    target="_blank"
                    rel="noopener"
                  />
                }
              >
                <Image
                  className="rounded-sm"
                  src={user.affiliateBadge.logo}
                  alt={user.affiliateBadge.name}
                  width={20}
                  height={20}
                  quality={100}
                  unoptimized
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t.rich("affiliateOf", {
                    name: user.affiliateBadge.name,
                    link: (chunks) => (
                      <a
                        className="font-medium underline-offset-4 hover:underline"
                        href={affiliateUrl}
                        target="_blank"
                        rel="noopener"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="h-9 border-t border-edge py-1 pl-4">
          <FlipSentences
            className="font-pixel-square text-sm text-balance text-muted-foreground"
            variants={{
              initial: { y: -10, opacity: 0 },
              animate: { y: -1, opacity: 1 },
              exit: { y: 10, opacity: 0 },
            }}
          >
            {user.flipSentences}
          </FlipSentences>
        </div>
      </div>
    </div>
  )
}
