import { Markdown } from "@/components/markdown"
import { ProseMono } from "@/components/ui/typography"
import { getLocale, getTranslations } from "next-intl/server"

import { getUserByLocale } from "@/features/portfolio/data/user"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export async function About() {
  const locale = await getLocale()
  const t = await getTranslations("Portfolio")
  const user = getUserByLocale(locale === "vi" ? "vi" : "en")

  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle>{t("about")}</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <ProseMono>
          <Markdown>{user.about}</Markdown>
        </ProseMono>
      </PanelContent>
    </Panel>
  )
}
