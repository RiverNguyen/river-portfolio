import { getLocale, getTranslations } from "next-intl/server"

import { getEducationByLocale } from "../data/experiences"
import { ExperienceItem } from "./experiences/experience-item"
import { Panel, PanelHeader, PanelTitle } from "./panel"

export async function Education() {
  const locale = await getLocale()
  const t = await getTranslations("Portfolio")
  const education = getEducationByLocale(locale === "vi" ? "vi" : "en")

  if (education.length === 0) return null

  return (
    <Panel id="education">
      <PanelHeader>
        <PanelTitle>{t("education")}</PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {education.map((item) => (
          <ExperienceItem key={item.id} experience={item} />
        ))}
      </div>
    </Panel>
  )
}
