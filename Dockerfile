FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# COPY .npmrc .
# COPY /src/lib/gsap/gsap-bonus.tgz /app/src/lib/gsap/gsap-bonus.tgz

# Omit --production flag for TypeScript devDependencies
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm i --force; \
    elif [ -f pnpm-lock.yaml ]; then npm i --force; \
    # Allow install without lockfile, so example works even without Node.js installed locally
    else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
    fi

COPY . .


# Ensure .next/cache directory exists and has the correct permissions
RUN mkdir -p /app/.next/cache/images && chmod -R 755 /app/.next/cache

# Non-secret build-time config only (never bake API keys into the image)
ARG APP_URL
ENV APP_URL=${APP_URL}

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
# ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js based on the preferred package manager
RUN \
    if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then npm run build; \
    else yarn build; \
    fi

# Step 2. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

# Don't run production as root (entrypoint drops privileges after fixing volume perms)
RUN apk add --no-cache su-exec
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /app/.next/cache /app/data && chown -R nextjs:nodejs /app/data

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/cache ./.next/cache
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# COPY --chown=nextjs:nodejs --from=builder /app/ ./

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Secrets are injected at runtime via compose/env_file — do not ARG/ENV them here
ENV VISITORS_DATA_PATH=/app/data/visitors.json

# Note: Don't expose ports here, Compose will handle that for us

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
