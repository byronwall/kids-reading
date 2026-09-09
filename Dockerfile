# syntax=docker/dockerfile:1.6

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable \
  && corepack prepare pnpm@11.9.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV SKIP_ENV_VALIDATION=1
RUN pnpm build

FROM base AS runtime
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN mkdir -p /app/data

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/content ./content
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/src/content ./src/content
COPY --from=build /app/package.json /app/tsconfig.json ./

EXPOSE 3000
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && ./node_modules/.bin/tsx scripts/curriculum-sync.ts --apply && ./node_modules/.bin/next start"]
