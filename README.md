# River Portfolio

Personal site of **Nguyễn Đình Giang** (River), a frontend developer in Hà Nội.

**Live:** [rivernguyen.id.vn](https://rivernguyen.id.vn)
**Source:** [github.com/RiverNguyen/river-portfolio](https://github.com/RiverNguyen/river-portfolio)

Next.js App Router site: portfolio, case studies, printable resume, MDX blog, contact, guestbook, and a small component registry. English is the default locale (`/`). Vietnamese is prefixed (`/vi/...`) via `next-intl` with `localePrefix: as-needed`.

The app starts with no environment variables. Each missing key turns off only the feature that reads it.

## Pages

| Path                 | What                                                           |
| -------------------- | -------------------------------------------------------------- |
| `/`                  | Profile, experience, stack, now, featured work                 |
| `/projects`          | Project archive                                                |
| `/projects/[slug]`   | Case study                                                     |
| `/resume`            | Printable CV from portfolio data. PDF: `public/pdf/resume.pdf` |
| `/blog`              | Post list and search                                           |
| `/blog/[slug]`       | Post, table of contents, views, reactions, newsletter          |
| `/blog/rss`          | Blog RSS                                                       |
| `/contact`           | Contact form                                                   |
| `/hire`              | Hiring page                                                    |
| `/guestbook`         | Signed-in guestbook (GitHub OAuth + Redis)                     |
| `/stats`             | Visitor totals, top posts, guestbook count                     |
| `/components`        | Component registry index                                       |
| `/components/[slug]` | One registry entry                                             |
| `/components/rss`    | Registry RSS                                                   |
| `/sponsors`          | Sponsors                                                       |
| `/testimonials`      | Testimonials                                                   |
| `/pond`              | Short standalone note                                          |

Prefix any of those with `/vi` for Vietnamese. A blog slug without a file in `content/vi/` falls back to the English post.

Plain-text routes for crawlers and assistants:

| Path                 | What                |
| -------------------- | ------------------- |
| `/llms.txt`          | Short site index    |
| `/llms-full.txt`     | Longer profile dump |
| `/about.md`          | About               |
| `/projects.md`       | Projects            |
| `/experience.md`     | Experience          |
| `/awards.md`         | Awards              |
| `/certifications.md` | Certifications      |
| `/blog.mdx/[slug]`   | One post as MDX     |

`/sitemap.xml` and `/robots.txt` are generated. `/og` is the layout used for the social preview, not a public page in the nav.

## Behavior that is not a page

- **Chat** — `POST /api/chat`. Gemini when `GOOGLE_GENERATIVE_AI_API_KEY` is set. Otherwise a local phrase matcher. Both return a plain-text stream.
- **Blog views** — `GET`/`POST /api/views`. One increment per browser session, only for a real slug. Hidden when Redis is unset.
- **Live readers** — `POST /api/views/live`. Open tabs heartbeat; the count is tabs seen in the last minute. Needs Redis.
- **Reactions** — `GET`/`POST /api/reactions` (`like`, `fire`, `idea`). Needs Redis.
- **Visitors** — `GET`/`POST /api/visitors`. Redis when configured, otherwise `data/visitors.json`. A failed write does not fail the page.
- **Now playing** — `GET /api/now-playing` from Last.fm.
- **Newsletter** — `POST /api/newsletter` adds the address to a Resend Audience. The form renders only when both `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` are set.
- **Contact** — `POST /api/contact`. Resend is tried first. Gmail is used when Resend is unset or the Resend send throws. Neither configured returns 503. Limited to 3 sends per IP per 10 minutes.
- **Guestbook** — `GET`/`POST /api/guestbook`, sign-in at `/api/guestbook/auth/signin`, callback `/api/guestbook/auth/callback`. Entries live in Redis.
- **Rate limits** — Upstash when set. Otherwise an in-memory bucket on that one server process.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com)
- [next-intl](https://next-intl.dev)
- MDX, Motion, GSAP, Swiper, Lenis
- Upstash Redis, Resend, Nodemailer, Gemini

## Requirements

- Node.js **24** (`engines` and CI)
- [pnpm](https://pnpm.io) **10** (`packageManager` is `pnpm@10.23.0`; `engines.pnpm` is `>=9`)

The only lockfile is `pnpm-lock.yaml`. CI installs with `pnpm install --frozen-lockfile`.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). `pnpm dev:turbo` starts Turbopack instead of webpack.

```bash
pnpm build
pnpm start
# build and start
pnpm preview
```

## Environment

Put variables in `.env` or `.env.local`. Do not commit either file.

| Variable                          | Used for                                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `APP_URL`                         | Canonical URL, metadata, Docker build arg. Default `https://rivernguyen.id.vn`                             |
| `GMAIL_USER`                      | Contact form, Nodemailer                                                                                   |
| `GMAIL_APP_PASSWORD`              | Gmail app password for Nodemailer                                                                          |
| `RESEND_API_KEY`                  | Contact form and newsletter                                                                                |
| `RESEND_FROM`                     | From address for Resend. A bare email gets the display name `River Nguyen <...>`                           |
| `RESEND_AUDIENCE_ID`              | Resend Audience for the post newsletter                                                                    |
| `UPSTASH_REDIS_REST_URL`          | Redis REST URL                                                                                             |
| `UPSTASH_REDIS_REST_TOKEN`        | Redis REST token                                                                                           |
| `KV_REST_API_URL`                 | Alternate name for the Redis URL                                                                           |
| `KV_REST_API_TOKEN`               | Alternate name for the Redis token                                                                         |
| `GOOGLE_GENERATIVE_AI_API_KEY`    | Chat model. Unset → local replies                                                                          |
| `GITHUB_API_TOKEN`                | Star count in the nav                                                                                      |
| `GITHUB_CLIENT_ID`                | Guestbook GitHub OAuth app                                                                                 |
| `GITHUB_CLIENT_SECRET`            | Guestbook OAuth secret                                                                                     |
| `AUTH_SECRET`                     | Signs the guestbook session cookie (`openssl rand -base64 32`)                                             |
| `LASTFM_API_KEY`                  | Now-playing row                                                                                            |
| `LASTFM_USERNAME`                 | Last.fm user                                                                                               |
| `NEXT_PUBLIC_POSTHOG_KEY`         | PostHog. Loaded only in production                                                                         |
| `NEXT_PUBLIC_POSTHOG_HOST`        | PostHog ingest host                                                                                        |
| `NEXT_PUBLIC_POSTHOG_UI_HOST`     | PostHog UI host                                                                                            |
| `NEXT_PUBLIC_OPENPANEL_CLIENT_ID` | OpenPanel                                                                                                  |
| `VISITORS_DATA_PATH`              | Visitor JSON path when Redis is unset. Default `data/visitors.json`. Docker sets `/app/data/visitors.json` |
| `REGISTRY_NAMESPACE`              | shadcn registry namespace. Default is in `src/config/registry.ts`                                          |
| `REGISTRY_NAMESPACE_URL`          | URL pattern for that namespace (`{name}` is the component)                                                 |

Guestbook OAuth callback: `<APP_URL>/api/guestbook/auth/callback`. Guestbook also needs Redis.

On a host with an ephemeral disk, set the Upstash variables. The JSON visitor file is wiped on every deploy there. Blog views, reactions, live readers, and guestbook have no file fallback.

## Scripts

| Command               | What it does                                      |
| --------------------- | ------------------------------------------------- |
| `pnpm dev`            | Dev server, webpack                               |
| `pnpm dev:turbo`      | Dev server, Turbopack                             |
| `pnpm build`          | Production build                                  |
| `pnpm start`          | Serve `.next`                                     |
| `pnpm preview`        | `build` then `start`                              |
| `pnpm lint`           | ESLint                                            |
| `pnpm lint:fix`       | ESLint with fixes                                 |
| `pnpm check-types`    | `tsc --noEmit`                                    |
| `pnpm test`           | `node:test` via `tsx` (`src/**/*.test.ts`)        |
| `pnpm format:check`   | Prettier check (`ts`, `tsx`, `md`, `mdx`)         |
| `pnpm format:write`   | Prettier write                                    |
| `pnpm registry:build` | Rebuild the shadcn registry JSON under `public/r` |

CI (`.github/workflows/ci.yml`) runs on pushes to `main` and on pull requests: install, `check-types`, `lint`, `test`, `format:check`, `build`. Node 24.

## Docker

`docker-compose.yml` builds `Dockerfile`, passes `APP_URL` as a build arg, loads `.env` at runtime, and stores visitor JSON on the `app-data` volume. The app listens on container port 3000 and is published on the host at `127.0.0.1:3001`.

The compose file expects an external Docker network named `portfolio`:

```bash
docker network create portfolio
docker compose up -d --build
```

Secrets stay in `.env` (gitignored and listed in `.dockerignore`). Only `APP_URL` is a build arg.

## Editing content

English copy and the default blog live next to the data. Vietnamese blog posts are the same slug under `vi/`.

| Edit                     | File                                            |
| ------------------------ | ----------------------------------------------- |
| Name, bio, jobs          | `src/features/portfolio/data/user.ts`           |
| Projects                 | `src/features/portfolio/data/projects.ts`       |
| Case studies             | `src/features/portfolio/data/case-studies.ts`   |
| Experience and education | `src/features/portfolio/data/experiences.ts`    |
| Tech stack               | `src/features/portfolio/data/tech-stack.ts`     |
| Now                      | `src/features/portfolio/data/now.ts`            |
| Awards                   | `src/features/portfolio/data/awards.ts`         |
| Certifications           | `src/features/portfolio/data/certifications.ts` |
| Testimonials             | `src/features/portfolio/data/testimonials.ts`   |
| Social links             | `src/features/portfolio/data/social-links.ts`   |
| Bookmarks                | `src/features/portfolio/data/bookmarks.ts`      |
| Resume fields            | `src/features/resume/data/resume.ts`            |
| Sponsors                 | `src/features/sponsors/data.tsx`                |
| Blog posts               | `src/features/blog/content/*.mdx`               |
| Vietnamese posts         | `src/features/blog/content/vi/*.mdx`            |
| UI strings               | `src/messages/en.json`, `src/messages/vi.json`  |
| Nav and site URL         | `src/config/site.ts`                            |

A new post is a pair of MDX files with the same name. Frontmatter needs `title`, `description`, `createdAt`, and `updatedAt` (`YYYY-MM-DD`). `image` is optional. Posts are picked up from disk: no registry list to update. Set `new: true` on the one post that should show the badge.

```text
src/
  app/                 # routes, API, sitemap, LLM text
  components/          # shared UI
  features/
    portfolio/         # profile data and sections
    blog/              # MDX and post UI
    resume/
    chatbot/
    guestbook/
    visitors/
    sponsors/
  messages/            # en.json, vi.json
  i18n/                # next-intl routing
  config/              # site.ts, registry.ts
public/                # images, pdf, registry JSON
```

## License

[MIT](LICENSE) © 2026 Nguyễn Đình Giang
