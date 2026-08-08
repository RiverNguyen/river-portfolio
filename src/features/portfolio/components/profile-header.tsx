import Image from "next/image"
import { getLocale, getTranslations } from "next-intl/server"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { UTM_PARAMS } from "@/config/site"
import { getUserByLocale } from "@/features/portfolio/data/user"
import { FlipSentences } from "@/registry/components/flip-sentences"
import { addQueryParams } from "@/utils/url"

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

  return (
    <div className="screen-line-after flex border-x border-edge">
      <div className="shrink-0 border-r border-edge">
        <div className="mx-0.5 my-0.75">
          <img
            className="size-30 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-40"
            alt={`${user.displayName}'s avatar`}
            src={user.avatar}
            fetchPriority="high"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="min-h-0 flex-1" aria-hidden />

        <div className="border-y border-edge">
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

        <div className="min-h-0 flex-1" aria-hidden />
      </div>
    </div>
  )
}
