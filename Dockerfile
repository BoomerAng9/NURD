# ============================================================================
# NURDSCODE — Phase 1 single-container image (FOAI canon, myclaw-vps target)
# ============================================================================
# Multi-stage build:
#   1. deps      — install all (incl dev) for build
#   2. builder   — vite build + esbuild server bundle
#   3. prod-deps — install production-only node_modules
#   4. runner    — node:20-alpine + imagemagick + non-root user
# ============================================================================

# ─── deps ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ─── builder ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# Output:
#   dist/index.js          ← esbuild server bundle
#   dist/public/           ← vite client static

# ─── prod-deps ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS prod-deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# ─── runner ──────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache imagemagick \
 && addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nurd

COPY --from=prod-deps --chown=nurd:nodejs /app/node_modules ./node_modules
COPY --from=builder   --chown=nurd:nodejs /app/dist          ./dist
COPY --from=builder   --chown=nurd:nodejs /app/package.json  ./package.json

RUN mkdir -p /app/uploads && chown -R nurd:nodejs /app/uploads

USER nurd

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "require('http').get('http://localhost:3000/',r=>{process.exit(r.statusCode<500?0:1)}).on('error',()=>process.exit(1))"

CMD ["node", "dist/index.js"]
