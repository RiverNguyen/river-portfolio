"use client"

import {
  DownloadIcon,
  ExternalLinkIcon,
  GithubIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PrinterIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { RESUME_PDF_URL } from "@/config/site"
import type { Resume } from "@/features/resume/types/resume"
import { cn } from "@/lib/utils"

type ResumePageContentProps = {
  resume: Resume
  labels: {
    objective: string
    experience: string
    skills: string
    projects: string
    education: string
    technologies: string
    responsibilities: string
    downloadPdf: string
    print: string
  }
}

export function ResumePageContent({ resume, labels }: ResumePageContentProps) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              header.sticky,
              footer.max-w-screen,
              .resume-actions,
              [data-slot="scroll-to-top"] {
                display: none !important;
              }

              main {
                padding: 0 !important;
                max-width: none !important;
                overflow: visible !important;
              }

              .resume-document {
                border: none !important;
                box-shadow: none !important;
                background: #fff !important;
                color: #111 !important;
                -webkit-print-color-adjust: economy;
                print-color-adjust: economy;
              }

              .resume-document header {
                display: block !important;
              }

              .resume-document,
              .resume-document * {
                color: #111 !important;
                background: transparent !important;
                box-shadow: none !important;
                text-shadow: none !important;
              }

              .resume-document a {
                color: #111 !important;
                text-decoration: underline;
              }

              .resume-document .text-muted-foreground,
              .resume-document [class*="text-muted"] {
                color: #444 !important;
              }

              .resume-document svg {
                color: #111 !important;
                stroke: #111 !important;
              }
            }
          `,
        }}
      />

      <div className="mx-auto md:max-w-3xl">
        <div className="resume-actions screen-line-after flex flex-wrap items-center justify-between gap-3 border-x border-edge px-4 py-3">
          <p className="font-mono text-sm text-muted-foreground">
            {resume.title}
          </p>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={RESUME_PDF_URL}
                download="Nguyen-Dinh-Giang-Resume.pdf"
              >
                <DownloadIcon />
                {labels.downloadPdf}
              </a>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              <PrinterIcon />
              {labels.print}
            </Button>
          </div>
        </div>

        <article className="resume-document screen-line-before screen-line-after border-x border-edge bg-background">
          <header className="screen-line-after px-4 py-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              {resume.name}
            </h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {resume.title}
            </p>

            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-sm">
              <li>
                <a
                  className="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-foreground"
                  href={`tel:${resume.contact.phone}`}
                >
                  <PhoneIcon className="size-3.5 shrink-0" aria-hidden />
                  {resume.contact.phone}
                </a>
              </li>

              <li>
                <a
                  className="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-foreground"
                  href={`mailto:${resume.contact.email}`}
                >
                  <MailIcon className="size-3.5 shrink-0" aria-hidden />
                  {resume.contact.email}
                </a>
              </li>

              <li>
                <a
                  className="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-foreground"
                  href={resume.contact.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon className="size-3.5 shrink-0" aria-hidden />
                  {resume.contact.github}
                </a>
              </li>

              <li className="inline-flex items-center gap-1.5 text-foreground/80">
                <MapPinIcon className="size-3.5 shrink-0" aria-hidden />
                {resume.contact.location}
              </li>
            </ul>
          </header>

          <ResumeSection title={labels.objective}>
            <p className="text-sm leading-relaxed text-balance text-muted-foreground">
              {resume.objective}
            </p>
          </ResumeSection>

          <ResumeSection title={labels.experience}>
            <div className="space-y-6">
              {resume.experience.map((item) => (
                <div key={`${item.company}-${item.period}`} className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-base font-semibold">
                      {item.companyUrl ? (
                        <a
                          className="underline-offset-4 hover:underline"
                          href={item.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.company}
                        </a>
                      ) : (
                        item.company
                      )}
                    </h3>
                    <time className="font-mono text-xs text-muted-foreground">
                      {item.period}
                    </time>
                  </div>

                  <p className="text-sm font-medium">{item.title}</p>

                  <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title={labels.skills}>
            <dl className="space-y-3">
              {resume.skills.map((skill) => (
                <div
                  key={skill.label}
                  className="grid gap-1 sm:grid-cols-[8.5rem_1fr]"
                >
                  <dt className="font-mono text-xs font-medium text-foreground">
                    {skill.label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">
                    {skill.value}
                  </dd>
                </div>
              ))}
            </dl>
          </ResumeSection>

          <ResumeSection title={labels.projects}>
            <div className="space-y-6">
              {resume.projects.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-base font-semibold">
                      {project.url ? (
                        <a
                          className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.name}
                          <ExternalLinkIcon
                            className="size-3.5 opacity-60"
                            aria-hidden
                          />
                        </a>
                      ) : (
                        project.name
                      )}
                    </h3>
                    <time className="font-mono text-xs text-muted-foreground">
                      {project.period}
                    </time>
                  </div>

                  <p className="text-sm font-medium">{project.role}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  <p className="font-mono text-xs text-muted-foreground">
                    <span className="text-foreground">{labels.technologies}:</span>{" "}
                    {project.technologies}
                  </p>

                  <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                    {project.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title={labels.education} className="border-b-0">
            <div className="space-y-2">
              {resume.education.map((item) => (
                <div key={item.school} className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-base font-semibold">{item.school}</h3>
                    <time className="font-mono text-xs text-muted-foreground">
                      {item.period}
                    </time>
                  </div>

                  <p className="text-sm font-medium">{item.degree}</p>

                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResumeSection>
        </article>

        <div className="h-4 border-x border-edge" />
      </div>
    </>
  )
}

function ResumeSection({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "screen-line-after border-b border-edge px-4 py-5 last:border-b-0",
        className
      )}
    >
      <h2 className="mb-4 font-mono text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}
