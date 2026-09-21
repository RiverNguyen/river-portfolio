import { cn } from "@/lib/utils"

export function CaseStudyArchitectureDiagram({
  steps,
  className,
}: {
  steps: string[]
  className?: string
}) {
  if (steps.length === 0) return null

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-edge bg-muted/20 p-4 sm:p-5",
        className
      )}
    >
      <ol className="flex min-w-min items-stretch gap-0 sm:gap-1">
        {steps.map((step, index) => (
          <li key={`${step}-${index}`} className="flex items-stretch">
            <div className="flex min-w-[6.5rem] max-w-[9rem] flex-col gap-2 sm:min-w-[7.5rem]">
              <span className="font-mono text-[10px] leading-none tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-1 items-center justify-center border border-edge bg-background px-2.5 py-2 text-center font-mono text-xs leading-snug text-foreground">
                {step}
              </span>
            </div>

            {index < steps.length - 1 ? (
              <div className="flex flex-col gap-2" aria-hidden>
                <span className="invisible font-mono text-[10px] leading-none">
                  00
                </span>
                <span className="hidden flex-1 items-center px-1 font-mono text-sm text-muted-foreground sm:flex">
                  →
                </span>
                <span className="flex flex-1 items-center px-2 sm:hidden">
                  <span className="h-px w-4 bg-edge" />
                </span>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
