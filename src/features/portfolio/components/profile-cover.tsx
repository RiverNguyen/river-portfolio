import { BrandContextMenu } from "@/components/brand-context-menu"
import { SpotlightLogo } from "@/components/spotlight-logo"
import { cn } from "@/lib/utils"

export function ProfileCover() {
  return (
    <BrandContextMenu>
      <div
        className={cn(
          "aspect-2/1 border-x border-edge select-none sm:aspect-3/1",
          "flex items-center justify-center text-black dark:text-white",
          "screen-line-before screen-line-after before:-top-px after:-bottom-px",
          "bg-black/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5"
        )}
      >
        <div id="js-cover-mark" className="w-full max-w-sm px-6 sm:max-w-md">
          <SpotlightLogo />
        </div>
      </div>
    </BrandContextMenu>
  )
}
