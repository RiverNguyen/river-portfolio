import React from "react"
import { getLocale, getTranslations } from "next-intl/server"

import { getExperiencesByLocale } from "../../data/experiences"
import { Panel, PanelHeader, PanelTitle } from "../panel"
import { ExperienceItem } from "./experience-item"

export async function Experiences() {
  const locale = await getLocale()
  const t = await getTranslations("Portfolio")
  const experiences = getExperiencesByLocale(locale === "vi" ? "vi" : "en")

  return (
    <Panel id="experience">
      <PanelHeader>
        <PanelTitle>{t("experience")}</PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {experiences.map((experience) => (
          <ExperienceItem key={experience.id} experience={experience} />
        ))}
      </div>
    </Panel>
  )
}
