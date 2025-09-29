# Stage 1: Build
FROM oven/bun:latest AS builder
WORKDIR /app

# Install deps
COPY package.json bun.lock ./
RUN bun install

# Copy source
COPY . .

# Build Vite app
RUN bun run build

# Stage 2: Nginx to serve static files
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Copy dist
COPY --from=builder /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
