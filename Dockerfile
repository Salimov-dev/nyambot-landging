# ============================================
# Multi-stage build для Next.js Landing
# ============================================

# Stage 1: Установка зависимостей
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Сборка приложения
FROM node:22-alpine AS builder
WORKDIR /app

# NEXT_PUBLIC_* переменные вкомпилируются при сборке
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=$NEXT_PUBLIC_YANDEX_METRIKA_ID

# Адрес главного сервера для fetch при сборке (пререндер юрстраниц). Несекретный,
# поэтому обычный ARG; в итоговый образ стадия builder не попадает.
ARG MAIN_SERVER_API_URL
ENV MAIN_SERVER_API_URL=$MAIN_SERVER_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 🔴 Ключа API на сборке нет вовсе: пререндер юрстраниц берёт документ только по
# адресу (`src/lib/legal-document.ts`), ключ нужен заявке и общей ссылке QR — в
# рантайме, из `environment` compose. Прежний ARG/ENV ключа оставался в
# `docker history --no-trunc` и `docker inspect`, а образ лежит архивом на
# ноутбуке и на проде (план docker-obrazy-2026-10-03, Ф4).
RUN npm run build

# Stage 3: Продакшен образ
FROM node:22-alpine AS runner
WORKDIR /app

# Пользователь создаётся ДО копирования — владельца задаём сразу при COPY.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 🔴 Серверные переменные нужны и В РАНТАЙМЕ: страницы юридических документов
# ревалидируются раз в час уже в контейнере, форма заявки и общая ссылка QR
# ходят на главный сервер с сервера лендинга. MAIN_SERVER_API_URL и
# MAIN_SERVER_API_KEY приходят из `environment` сервиса landing в
# docker-compose.prod.yml — в образе их нет, чтобы ключ не лежал в его слоях.
# Без них повторный поход за документом падает «MAIN_SERVER_API_URL не задан».

# 🔴 Владелец — при копировании (`--chown`), а не рекурсивной сменой владельца всего `/app` в конце.
# Рекурсивный chown переписывает метаданные каждого файла, то есть кладёт в
# образ ВТОРУЮ копию всего `/app` (в main-server это было 1,67 ГБ из 5,32 —
# см. main-server-nyambot/Dockerfile). Процесс пишет в `.next` (ISR юрстраниц,
# кеш) и `.next/static` — оба приходят ниже уже за nextjs — и в static-archive.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./

# static-archive — точка монтирования тома с файлами прошлых сборок
# (см. docker-entrypoint.sh). Каталог создаётся в образе, чтобы новый том
# унаследовал владельца nextjs; chown — точечно ему одному, не рекурсивно (он пуст).
# sed — страховка от CRLF из Windows-копии.
RUN sed -i 's/\r$//' docker-entrypoint.sh && \
    chmod +x docker-entrypoint.sh && \
    mkdir -p static-archive && \
    chown nextjs:nodejs static-archive

USER nextjs

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3200

EXPOSE 3200

# Проверка здоровья живёт только в docker-compose.prod.yml: там она своя
# (`node -e` + fetch) и всё равно перекрывала бы проверку из образа.

# Отпечаток сборки — коммит этого репозитория, виден `docker inspect` без
# запуска контейнера. Стоит в конце стадии: смена коммита не сбивает кеш слоёв
# выше. Прежнее копирование файла версии из контекста копировало пустоту — файла там
# нет, и код его не читает.
ARG BUILD_COMMIT=unknown
LABEL org.opencontainers.image.revision=$BUILD_COMMIT

CMD ["./docker-entrypoint.sh"]
