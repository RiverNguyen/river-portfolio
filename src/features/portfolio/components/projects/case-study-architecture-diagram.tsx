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
          <li key={`${step}-${index}`} className="flex items-center">
            <div className="flex min-w-[6.5rem] max-w-[9rem] flex-col gap-2 sm:min-w-[7.5rem]">
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="border border-edge bg-background px-2.5 py-2 text-center font-mono text-xs leading-snug text-foreground">
                {step}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span
                aria-hidden
                className="mx-1 hidden font-mono text-sm text-muted-foreground sm:inline"
              >
                →
              </span>
            ) : null}
            {index < steps.length - 1 ? (
              <span
                aria-hidden
                className="mx-2 h-px w-4 bg-edge sm:hidden"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
