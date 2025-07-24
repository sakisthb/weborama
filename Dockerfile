# Multi-stage Dockerfile for Ads Pro Platform - Option D Implementation
# Optimized for production deployment with security best practices

# ===================================
# BUILD STAGE
# ===================================
FROM node:20-alpine AS builder

# Build arguments
ARG NODE_VERSION
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

# Metadata labels
LABEL org.opencontainers.image.title="Ads Pro Platform"
LABEL org.opencontainers.image.description="Enterprise SaaS platform for multi-touch attribution and campaign optimization"
LABEL org.opencontainers.image.created=$BUILD_DATE
LABEL org.opencontainers.image.revision=$VCS_REF
LABEL org.opencontainers.image.version=$VERSION
LABEL org.opencontainers.image.source="https://github.com/ads-pro-platform/ui"

# Install build dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Generate build info
RUN echo "{\
  \"version\": \"$VERSION\",\
  \"buildDate\": \"$BUILD_DATE\",\
  \"vcsRef\": \"$VCS_REF\",\
  \"nodeVersion\": \"$NODE_VERSION\"\
}" > dist/build-info.json

# ===================================
# NGINX STAGE
# ===================================
FROM nginx:1.25-alpine AS nginx

# Install security updates
RUN apk upgrade --no-cache && \
    apk add --no-cache \
    tini \
    curl \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Create required directories
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R nextjs:nodejs /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Expose port
EXPOSE 8080

# Use tini as entrypoint for proper signal handling
ENTRYPOINT ["tini", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ===================================
# DEVELOPMENT STAGE
# ===================================
FROM node:20-alpine AS development

# Install development dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    curl \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Copy package files
COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY --chown=nextjs:nodejs . .

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start development server
CMD ["pnpm", "dev"]