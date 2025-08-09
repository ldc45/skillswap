FROM node:20-alpine AS base

# Install Java (si nécessaire pour votre app)
RUN apk add --no-cache openjdk17-jre

# Step 1: Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Step 2: Development environment
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

# Step 3: Build for production
FROM deps AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables pour le build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build de l'application Next.js
RUN npm run build

# Step 4: Prune dependencies for production
FROM base AS prunner
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Step 5: Production image
FROM base AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1024 nodejs && \
    adduser --system --uid 1024 nextjs

# Copy all files with proper ownership
COPY --chown=nextjs:nodejs --from=prunner /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs --from=prunner /app/package*.json ./
COPY --chown=nextjs:nodejs --from=build /app/.next ./.next
COPY --chown=nextjs:nodejs --from=build /app/public ./public

# Create .next/cache directory with proper permissions
USER nextjs
RUN mkdir -p .next/cache

EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
