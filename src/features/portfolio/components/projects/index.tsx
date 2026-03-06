import { CollapsibleList } from "@/components/collapsible-list"
import { getLocale, getTranslations } from "next-intl/server"

import { getProjectsByLocale } from "../../data/projects"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "../panel"
import { ProjectItem } from "./project-item"

export async function Projects() {
  const locale = await getLocale()
  const t = await getTranslations("Portfolio")
  const projects = getProjectsByLocale(locale === "vi" ? "vi" : "en")

  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle>
          {t("projects")}
          <PanelTitleSup>({projects.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={projects}
        max={4}
        renderItem={(item) => <ProjectItem project={item} />}
      />
    </Panel>
  )
}
