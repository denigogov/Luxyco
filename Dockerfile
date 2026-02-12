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


# ---------- 3) Demo runtime (client + server + MySQL in same container) ----------
# WARNING: demo only - DB is ephemeral and will reset on restart/deploy
FROM node:22-alpine AS runner
WORKDIR /app/server

ENV NODE_ENV=production
RUN corepack enable

# Install MariaDB (MySQL-compatible) for demo DB inside the container
RUN apk add --no-cache mariadb mariadb-client

# Install prod deps only (Prisma CLI not included, but we run it via node path)
COPY server/package.json server/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

# Copy built server + prisma
COPY --from=server_builder /app/server/dist ./dist
COPY --from=server_builder /app/server/prisma ./prisma

# Copy React build into Nest public folder
COPY --from=client_builder /app/client/dist ./public

# Copy the demo start script (you must create this file at repo root)
COPY start-demo.sh /start-demo.sh
RUN chmod +x /start-demo.sh

EXPOSE 4000

CMD ["/start-demo.sh"]
