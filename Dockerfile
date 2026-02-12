# ---------- 1) Build client (Vite) ----------
FROM node:22-alpine AS client_builder
WORKDIR /app/client

RUN corepack enable

COPY client/package.json client/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY client/ ./
RUN pnpm build


# ---------- 2) Build server (Nest + Prisma) ----------
FROM node:22-alpine AS server_builder
WORKDIR /app/server

RUN corepack enable

COPY server/package.json server/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY server/ ./

# Prisma client + Nest build
RUN pnpm prisma generate
RUN pnpm build


# ---------- 3) Production runtime ----------
FROM node:22-alpine AS runner
WORKDIR /app/server

ENV NODE_ENV=production
RUN corepack enable

# Install prod deps only
COPY server/package.json server/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

# Copy built server + prisma
COPY --from=server_builder /app/server/dist ./dist
COPY --from=server_builder /app/server/prisma ./prisma

# Copy React build into Nest public folder
COPY --from=client_builder /app/client/dist ./public

EXPOSE 4000

# Run migrations then start
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main"]
