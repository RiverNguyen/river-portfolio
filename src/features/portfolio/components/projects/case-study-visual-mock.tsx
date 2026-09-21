import type { ComponentProps, ComponentType } from "react"

import { cn } from "@/lib/utils"

import type { CaseStudyVisualVariant } from "../../data/case-study-visuals"

type CaseStudyVisualMockProps = {
  variant: CaseStudyVisualVariant
  caption: string
  note: string
  callouts: {
    primary: string
    secondary: string
  }
  className?: string
}

function Block({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-sm border border-edge/80 bg-background/60",
        className
      )}
      {...props}
    />
  )
}

function Callout({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "absolute z-10 max-w-[9rem] rounded-sm border border-edge bg-background/95 px-2 py-1 font-mono text-[10px] leading-snug text-foreground shadow-sm",
        className
      )}
    >
      <span className="mr-1 text-muted-foreground">→</span>
      {label}
    </div>
  )
}

function TourFiltersMock({ callouts }: Pick<CaseStudyVisualMockProps, "callouts">) {
  return (
    <>
      <div className="grid h-full grid-cols-[7.5rem_1fr] gap-3">
        <Block className="space-y-2 p-2">
          <Block className="h-2 w-2/3 bg-muted-foreground/20" />
          {[0, 1, 2, 3].map((item) => (
            <Block key={item} className="h-6 bg-muted/80" />
          ))}
        </Block>
        <div className="grid grid-cols-2 gap-2 content-start">
          {[0, 1, 2, 3].map((item) => (
            <Block key={item} className="space-y-2 p-2">
              <Block className="aspect-[4/3] bg-muted" />
              <Block className="h-2 w-4/5 bg-muted-foreground/25" />
              <Block className="h-2 w-1/2 bg-muted-foreground/15" />
            </Block>
          ))}
        </div>
      </div>
      <Callout label={callouts.primary} className="left-2 top-2" />
      <Callout label={callouts.secondary} className="bottom-3 right-2" />
    </>
  )
}

function CorporateSectionsMock({
  callouts,
}: Pick<CaseStudyVisualMockProps, "callouts">) {
  return (
    <>
      <div className="flex h-full flex-col gap-2">
        <Block className="h-[38%] bg-muted p-3">
          <Block className="mx-auto mt-4 h-3 w-2/5 bg-muted-foreground/25" />
          <Block className="mx-auto mt-2 h-2 w-1/3 bg-muted-foreground/15" />
        </Block>
        <div className="grid flex-1 grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <Block key={item} className="space-y-2 p-2">
              <Block className="h-2 w-2/3 bg-muted-foreground/20" />
              <Block className="h-2 w-full bg-muted-foreground/10" />
              <Block className="h-2 w-4/5 bg-muted-foreground/10" />
            </Block>
          ))}
        </div>
      </div>
      <Callout label={callouts.primary} className="left-3 top-3" />
      <Callout label={callouts.secondary} className="bottom-3 right-3" />
    </>
  )
}

function AuthShellMock({ callouts }: Pick<CaseStudyVisualMockProps, "callouts">) {
  return (
    <>
      <div className="grid h-full grid-cols-2 gap-3">
        <Block className="space-y-2 p-3">
          {[0, 1, 2].map((item) => (
            <Block key={item} className="h-3 w-full bg-muted-foreground/12" />
          ))}
        </Block>
        <Block className="flex flex-col justify-center gap-2 p-4">
          <Block className="h-2 w-1/2 bg-muted-foreground/25" />
          <Block className="h-8 bg-muted" />
          <Block className="h-8 bg-muted" />
          <Block className="h-7 bg-foreground/80" />
        </Block>
      </div>
      <Callout label={callouts.primary} className="left-2 top-2" />
      <Callout label={callouts.secondary} className="bottom-3 right-2" />
    </>
  )
}

function AgencyShowcaseMock({
  callouts,
}: Pick<CaseStudyVisualMockProps, "callouts">) {
  return (
    <>
      <div className="grid h-full grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <Block
            key={item}
            className={cn(
              "bg-muted",
              item === 0 && "col-span-2 row-span-2"
            )}
          />
        ))}
      </div>
      <Callout label={callouts.primary} className="left-2 top-2" />
      <Callout label={callouts.secondary} className="bottom-3 right-2" />
    </>
  )
}

function CatalogGridMock({ callouts }: Pick<CaseStudyVisualMockProps, "callouts">) {
  return (
    <>
      <div className="flex h-full flex-col gap-2">
        <Block className="h-8 shrink-0 bg-muted/90" />
        <div className="grid flex-1 grid-cols-4 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
            <Block key={item} className="aspect-square bg-muted" />
          ))}
        </div>
      </div>
      <Callout label={callouts.primary} className="left-2 top-2" />
      <Callout label={callouts.secondary} className="bottom-3 right-2" />
    </>
  )
}

function SalonStepsMock({ callouts }: Pick<CaseStudyVisualMockProps, "callouts">) {
  return (
    <>
      <div className="flex h-full flex-col gap-3 p-1">
        <div className="flex items-center justify-between gap-2">
          {["1", "2", "3"].map((step, index) => (
            <div key={step} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex size-6 items-center justify-center border border-edge font-mono text-[10px]",
                  index === 1 && "bg-foreground text-background"
                )}
              >
                {step}
              </span>
              {index < 2 ? (
                <span className="h-px flex-1 bg-edge" aria-hidden />
              ) : null}
            </div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2">
          <Block className="space-y-2 p-2">
            {[0, 1, 2].map((item) => (
              <Block key={item} className="h-7 bg-muted" />
            ))}
          </Block>
          <Block className="space-y-2 p-2">
            <Block className="h-16 bg-muted" />
            <Block className="h-7 bg-foreground/75" />
          </Block>
        </div>
      </div>
      <Callout label={callouts.primary} className="left-2 top-2" />
      <Callout label={callouts.secondary} className="bottom-3 right-2" />
    </>
  )
}

function LocaleToggleMock({ callouts }: Pick<CaseStudyVisualMockProps, "callouts">) {
  return (
    <>
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-between">
          <Block className="h-6 w-24 bg-muted" />
          <div className="flex gap-1">
            {["EN", "ZH"].map((locale, index) => (
              <span
                key={locale}
                className={cn(
                  "border border-edge px-2 py-0.5 font-mono text-[10px]",
                  index === 0 && "bg-foreground text-background"
                )}
              >
                {locale}
              </span>
            ))}
          </div>
        </div>
        <Block className="flex-1 space-y-2 p-3">
          <Block className="h-3 w-1/2 bg-muted-foreground/20" />
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((item) => (
              <Block key={item} className="h-8 bg-muted" />
            ))}
          </div>
          <Block className="mt-auto h-20 bg-muted" />
        </Block>
      </div>
      <Callout label={callouts.primary} className="left-2 top-2" />
      <Callout label={callouts.secondary} className="bottom-3 right-2" />
    </>
  )
}

function ComboMapMock({ callouts }: Pick<CaseStudyVisualMockProps, "callouts">) {
  return (
    <>
      <div className="grid h-full grid-cols-[1fr_7rem] gap-2">
        <Block className="relative overflow-hidden bg-muted">
          <div className="absolute inset-4 rounded-full border border-dashed border-edge/80" />
          <Block className="absolute left-1/3 top-1/3 size-3 rounded-full bg-foreground/70" />
          <Block className="absolute right-1/4 bottom-1/3 size-3 rounded-full bg-foreground/40" />
        </Block>
        <Block className="space-y-2 p-2">
          <Block className="h-6 bg-muted" />
          <Block className="h-6 bg-muted" />
          <Block className="h-10 bg-muted-foreground/15" />
        </Block>
      </div>
      <Callout label={callouts.primary} className="left-2 top-2" />
      <Callout label={callouts.secondary} className="bottom-3 right-2" />
    </>
  )
}

function LuxuryScrollMock({ callouts }: Pick<CaseStudyVisualMockProps, "callouts">) {
  return (
    <>
      <div className="flex h-full flex-col gap-2">
        <Block className="h-[55%] bg-muted" />
        <div className="grid flex-1 grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <Block key={item} className="bg-muted/80" />
          ))}
        </div>
      </div>
      <Callout label={callouts.primary} className="left-2 top-2" />
      <Callout label={callouts.secondary} className="bottom-3 right-2" />
    </>
  )
}

function AiCinematicMock({ callouts }: Pick<CaseStudyVisualMockProps, "callouts">) {
  return (
    <>
      <div className="relative h-full overflow-hidden rounded-sm bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
        <Block className="absolute left-4 top-1/2 w-[45%] -translate-y-1/2 space-y-2 border-zinc-700 bg-zinc-900/80 p-3">
          <Block className="h-2 w-3/4 bg-zinc-600" />
          <Block className="h-2 w-1/2 bg-zinc-700" />
          <Block className="h-6 w-24 bg-zinc-100/90" />
        </Block>
        <div className="absolute bottom-3 right-3 flex gap-1">
          {[0, 1, 2].map((item) => (
            <Block key={item} className="size-8 border-zinc-700 bg-zinc-800" />
          ))}
        </div>
      </div>
      <Callout
        label={callouts.primary}
        className="left-2 top-2 border-zinc-700 bg-zinc-950/90 text-zinc-100"
      />
      <Callout
        label={callouts.secondary}
        className="bottom-3 right-2 border-zinc-700 bg-zinc-950/90 text-zinc-100"
      />
    </>
  )
}

const MOCK_BY_VARIANT: Record<
  CaseStudyVisualVariant,
  ComponentType<Pick<CaseStudyVisualMockProps, "callouts">>
> = {
  "tour-filters": TourFiltersMock,
  "corporate-sections": CorporateSectionsMock,
  "auth-shell": AuthShellMock,
  "agency-showcase": AgencyShowcaseMock,
  "catalog-grid": CatalogGridMock,
  "salon-steps": SalonStepsMock,
  "locale-toggle": LocaleToggleMock,
  "combo-map": ComboMapMock,
  "luxury-scroll": LuxuryScrollMock,
  "ai-cinematic": AiCinematicMock,
}

export function CaseStudyVisualMock({
  variant,
  caption,
  note,
  callouts,
  className,
}: CaseStudyVisualMockProps) {
  const Mock = MOCK_BY_VARIANT[variant]

  return (
    <figure className={cn("space-y-2", className)}>
      <figcaption className="flex items-center justify-between px-1 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        <span>{caption}</span>
        <span className="normal-case tracking-normal opacity-80">{note}</span>
      </figcaption>
      <div className="screen-line-after overflow-hidden rounded-xl border border-edge bg-background/40">
        <div className="relative aspect-[16/10] bg-muted/40 p-3 sm:p-4">
          <Mock callouts={callouts} />
        </div>
      </div>
    </figure>
  )
}
