# syntax=docker/dockerfile:1.7

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Enable pnpm via corepack and install deps (cached)
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN pnpm build

# Prune devDependencies for runtime
RUN pnpm prune --prod

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Enable pnpm via corepack (no global installs)
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Expose port (default Next.js port)
EXPOSE 3000

# Set environment for production
ENV NODE_ENV=production

# Start the application
CMD ["pnpm", "start"]

