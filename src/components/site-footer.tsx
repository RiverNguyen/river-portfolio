import Link from "next/link"
import { SITE_INFO, SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { cn } from "@/lib/utils"

import { Icons } from "./icons"

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-hidden px-2">
      <div className="screen-line-before mx-auto border-x border-edge pt-4 md:max-w-3xl">
        <p className="mb-1 px-4 text-center font-mono text-sm text-balance text-muted-foreground">
          Made with ❤️ by Giang Nguyen Dinh
        </p>

        <p className="mb-4 px-4 text-center font-mono text-sm text-balance text-muted-foreground">
          The source code is available on{" "}
          <a
            className="link"
            href={SOURCE_CODE_GITHUB_URL}
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
          .
        </p>

        <div className="screen-line-before flex justify-center gap-2 py-3 font-mono text-xs text-muted-foreground sm:hidden">
          <Link className="font-medium" href="/blog">
            Blog
          </Link>

          <span className="opacity-50">•</span>

          <a
            className="font-medium"
            href={`${SITE_INFO.url}/resume`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
        </div>

        <div className="screen-line-before screen-line-after flex w-full before:z-1 after:z-1">
          <div className="mx-auto flex items-center justify-center gap-3 border-x border-edge bg-background px-4">
            <Link
              className="flex font-mono text-xs font-medium text-muted-foreground max-sm:hidden"
              href="/blog"
            >
              Blog
            </Link>

            <Separator className="max-sm:hidden" />

            <a
              className="flex font-mono text-xs font-medium text-muted-foreground max-sm:hidden"
              href={`${SITE_INFO.url}/resume`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>

            <Separator className="max-sm:hidden" />

            <a
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
              href="https://www.facebook.com/river1309"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.facebook className="size-4" />
              <span className="sr-only">Facebook</span>
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
              href="https://github.com/RiverNguyen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.github className="size-4" />
              <span className="sr-only">GitHub</span>
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
              href="https://www.linkedin.com/in/river1309"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.linkedin className="size-4" />
              <span className="sr-only">LinkedIn</span>
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
              href="https://zalo.me/0345613090"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.zalo className="size-4" />
              <span className="sr-only">Zalo</span>
            </a>
          </div>
        </div>
      </div>
      <div className="pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex h-2" />
      </div>
    </footer>
  )
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex h-11 w-px bg-edge", className)} {...props} />
}
