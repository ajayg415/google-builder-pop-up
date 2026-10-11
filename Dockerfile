# Multi-stage Dockerfile for Google Cloud Run
# Stage 1: Build the production Vite bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Run production build (TypeScript + Vite)
RUN npm run build

# Stage 2: Serve the production static app
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install lightweight static file server
RUN npm install -g serve

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist

# Cloud Run injects PORT environment variable (default: 8080)
ENV PORT=8080
EXPOSE 8080

# Start server bound to Cloud Run PORT with SPA fallback
CMD ["sh", "-c", "serve -s dist -l ${PORT:-8080}"]
