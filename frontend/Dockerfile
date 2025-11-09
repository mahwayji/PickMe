# ---------- Stage 1: Build ----------
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy and install dependencies
COPY bun.lock package.json ./
RUN bun install

# Copy the rest of the frontend code
COPY . .

# Build React app
RUN bun run build

# ---------- Stage 2: Serve ----------
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for serving
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
