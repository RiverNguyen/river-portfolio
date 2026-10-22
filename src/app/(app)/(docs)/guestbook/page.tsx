import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"

import {
  GuestbookDeleteButton,
  GuestbookForm,
} from "@/features/guestbook/components/guestbook-form"
import { getCurrentUser, isOwner } from "@/features/guestbook/lib/current-user"
import { getAuthConfig } from "@/features/guestbook/lib/session"
import { getEntries } from "@/features/guestbook/lib/store"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Guestbook")

  return createPageMetadata({
    path: "/guestbook",
    title: t("title"),
    description: t("description"),
    type: "website",
  })
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const t = await getTranslations("Guestbook")
  const locale = await getLocale()
  const { error } = await searchParams
  const [user, entries] = await Promise.all([getCurrentUser(), getEntries()])
  const enabled = getAuthConfig() !== null && entries !== null
  const owner = isOwner(user?.login)
  const formatDate = new Intl.DateTimeFormat(
    locale === "vi" ? "vi-VN" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric" }
  )

  return (
    <div className="min-h-svh">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="screen-line-before screen-line-after p-4">
        {!enabled ? (
          <p className="font-mono text-sm">{t("notConfigured")}</p>
        ) : (
          <>
            {error === "auth" && (
              <p
                role="alert"
                className="mb-3 font-mono text-sm text-destructive"
              >
                {t("authError")}
              </p>
            )}
            <GuestbookForm user={user} />
          </>
        )}
      </div>

      {enabled && (
        <ul className="divide-y divide-edge">
          {entries.length === 0 && (
            <li className="p-4 font-mono text-sm">{t("empty")}</li>
          )}
          {entries.map((entry) => (
            <li key={entry.id} className="flex gap-3 p-4">
              <img
                src={entry.avatar}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full border border-edge"
              />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                  <a
                    href={`https://github.com/${entry.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {entry.name}
                  </a>
                  <time
                    dateTime={entry.createdAt}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    {formatDate.format(new Date(entry.createdAt))}
                  </time>
                  {owner && <GuestbookDeleteButton id={entry.id} />}
                </p>
                <p className="mt-1 text-sm break-words whitespace-pre-wrap">
                  {entry.message}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="screen-line-before h-4" />
    </div>
  )
}
