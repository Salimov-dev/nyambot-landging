# ============================================
# Multi-stage build для Next.js Landing
# ============================================

# Stage 1: Установка зависимостей
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app

# NEXT_PUBLIC_* переменные вкомпилируются при сборке
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=$NEXT_PUBLIC_YANDEX_METRIKA_ID

# Серверные переменные для fetch при сборке (SSR/ISR)
ARG MAIN_SERVER_API_URL
ARG MAIN_SERVER_API_KEY
ENV MAIN_SERVER_API_URL=$MAIN_SERVER_API_URL
ENV MAIN_SERVER_API_KEY=$MAIN_SERVER_API_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Продакшен образ
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY version.json* ./

RUN chown -R nextjs:nodejs /app

USER nextjs

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3200

EXPOSE 3200

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3200/ || exit 1

CMD ["node", "server.js"]
