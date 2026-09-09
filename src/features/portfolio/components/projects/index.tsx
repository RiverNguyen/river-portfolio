import { ArrowRightIcon } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

import { getProjectsByLocale } from "../../data/projects"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "../panel"
import { ProjectItem } from "./project-item"

const HOME_PROJECTS_LIMIT = 4

export async function Projects() {
  const locale = await getLocale()
  const t = await getTranslations("Portfolio")
  const tPage = await getTranslations("ProjectsPage")
  const projects = getProjectsByLocale(locale === "vi" ? "vi" : "en")
  const preview = projects.slice(0, HOME_PROJECTS_LIMIT)

  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle>
          {t("projects")}
          <PanelTitleSup>({projects.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      {preview.map((item) => (
        <div key={item.id} className="border-b border-edge">
          <ProjectItem
            project={item}
            caseStudyLabel={tPage("caseStudy")}
            privateNotice={{
              title: tPage("privateTitle"),
              description: tPage("privateDesc"),
              cta: tPage("privateCta"),
            }}
          />
        </div>
      ))}

      <div className="screen-line-before flex justify-center py-2">
        <Button className="px-3" variant="default" asChild>
          <Link href="/projects">
            {tPage("allProjects")}
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </Panel>
  )
}
