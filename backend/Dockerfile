# Stage 1: Build
FROM oven/bun:latest AS builder
WORKDIR /app

# Install deps
COPY package.json bun.lock ./
RUN bun install

# Copy source
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build NestJS
RUN bun run build

# Stage 2: Runtime
FROM oven/bun:latest AS runner
WORKDIR /app

# Copy built app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
CMD ["bun", "run", "start:prod"]
