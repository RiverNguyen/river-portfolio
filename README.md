# River Portfolio

Personal portfolio of **Nguyễn Đình Giang** (River) — Frontend Developer based in Hà Nội.

**Live:** [rivernguyen.id.vn](https://rivernguyen.id.vn)

A minimal, pixel-perfect Next.js site with portfolio, project archive, resume, blog, and contact — bilingual **English / Vietnamese**.

## Features

- **Portfolio** — profile, experience, tech stack, and featured work
- **Projects** (`/projects`) — archive grid with detail dialog, image swiper, and live links
- **Resume** (`/resume`) — printable CV built from portfolio data
- **Blog** (`/blog`) — MDX posts with locale-aware content
- **i18n** — `en` (default) and `vi` via `next-intl` (`localePrefix: as-needed`)
- **SEO** — sitemap, robots, metadata, hreflang, LLM text routes
- **Motion** — Lenis smooth scroll, GSAP/Swiper where needed, page reveal

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19 · TypeScript · Tailwind CSS 4
- [next-intl](https://next-intl.dev) · [shadcn/ui](https://ui.shadcn.com)
- MDX · Motion · GSAP · Swiper · Lenis

## Getting started

### Requirements

- Node.js **22.x**
- [pnpm](https://pnpm.io) **≥ 9**

### Install

```bash
pnpm install
```

### Environment

Create a `.env` (or `.env.local`) as needed. Common variables:

| Variable                                                    | Description                                                                                                                                                                      |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`                                                   | Public site URL (default: `https://rivernguyen.id.vn`)                                                                                                                           |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD`                         | Contact form (Nodemailer)                                                                                                                                                        |
| `RESEND_API_KEY` / `RESEND_FROM`                            | Optional email via Resend                                                                                                                                                        |
| `RESEND_AUDIENCE_ID`                                        | Newsletter signup at the end of blog posts (Resend Audience; send new-post emails as Broadcasts from the Resend dashboard)                                                       |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`       | Rate limiting, visitor stats and blog views (`KV_REST_API_*` also works). Without it, limits are per-instance and views are hidden                                               |
| `GOOGLE_GENERATIVE_AI_API_KEY`                              | Gemini for the chatbot; falls back to canned local replies                                                                                                                       |
| `GITHUB_API_TOKEN`                                          | GitHub stars count in the nav                                                                                                                                                    |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST`      | PostHog analytics                                                                                                                                                                |
| `NEXT_PUBLIC_OPENPANEL_CLIENT_ID`                           | OpenPanel analytics                                                                                                                                                              |
| `VISITORS_DATA_PATH`                                        | Visitor stats JSON file when Redis is not set (default: `data/visitors.json`)                                                                                                    |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` / `AUTH_SECRET` | Guestbook sign-in (GitHub OAuth app, callback `<APP_URL>/api/guestbook/auth/callback`; `AUTH_SECRET` signs the session cookie, e.g. `openssl rand -base64 32`). Also needs Redis |
| `LASTFM_API_KEY` / `LASTFM_USERNAME`                        | "Listening" row in the Now section (connect Spotify to Last.fm to scrobble; free API key at last.fm/api)                                                                         |

### Develop

```bash
pnpm dev          # webpack (default)
pnpm dev:turbo    # Turbopack
```

Open [http://localhost:3000](http://localhost:3000).

### Build & run

```bash
pnpm build
pnpm start
# or
pnpm preview
```

### Docker

```bash
docker compose up -d --build
```

See `docker-compose.yml` / `Dockerfile` for image and env wiring.

## Scripts

| Command               | Description                     |
| --------------------- | ------------------------------- |
| `pnpm dev`            | Dev server (webpack)            |
| `pnpm build`          | Production build                |
| `pnpm start`          | Start production server         |
| `pnpm lint`           | ESLint                          |
| `pnpm check-types`    | TypeScript check                |
| `pnpm format:write`   | Prettier format                 |
| `pnpm registry:build` | Build shadcn component registry |

## Project structure

```text
src/
  app/                     # App Router (en + [locale])
  components/              # Shared UI
  features/
    portfolio/             # Profile, projects, experience data
    blog/                  # MDX posts + UI
    resume/                # Resume page
  messages/                # en.json · vi.json
  i18n/                    # next-intl routing & navigation
public/                    # Images, assets, project screenshots
```

### Content you usually edit

- Profile & about → `src/features/portfolio/data/user.ts`
- Projects → `src/features/portfolio/data/projects.ts`
- Experience → `src/features/portfolio/data/experiences.ts`
- Blog posts → `src/features/blog/content/` (+ `vi/` for Vietnamese)
- Translations → `src/messages/en.json`, `src/messages/vi.json`

## License

[MIT](LICENSE) © Nguyễn Đình Giang
