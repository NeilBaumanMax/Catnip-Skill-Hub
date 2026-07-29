FROM alpine:3.23 AS base
RUN apk add --no-cache nodejs=24.17.0-r0 npm=11.11.0-r0
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
COPY . .
RUN npm run build

FROM deps AS tester
COPY . .
CMD ["npm", "run", "test:integration"]

FROM deps AS migrator
COPY drizzle ./drizzle
COPY scripts/migrate.mjs ./scripts/migrate.mjs
CMD ["node", "scripts/migrate.mjs"]

FROM alpine:3.23 AS runner
RUN apk add --no-cache nodejs=24.17.0-r0
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S -g 1001 nodejs \
  && adduser -S -D -H -u 1001 -G nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/content ./content
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
