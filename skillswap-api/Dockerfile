FROM node:23-alpine AS base

# Step 1: Dependencies and Prisma generation (once)
FROM base AS deps
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
# Generate Prisma client once
RUN npx prisma generate

# Step 2: Development environment
FROM base AS dev
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/prisma ./prisma/
COPY . .
EXPOSE 4000
CMD ["npm", "run", "docker:dev"]

# Step 3: Build for production
FROM deps AS build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/prisma ./prisma/
COPY . .
RUN npm run build

# Step 4: Prune dependencies for production (but keep Prisma client)
FROM base AS prunner
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
# Copy Prisma schema (needed for migrations)
COPY --from=deps /usr/src/app/prisma ./prisma
# Copy the already generated Prisma client to avoid regenerating
COPY --from=deps /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Step 5: Production image
FROM base AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1024 nodejs && \
    adduser --system --uid 1024 nestjs

# Copy all files with proper ownership in a single step
COPY --chown=nestjs:nodejs --from=prunner /usr/src/app/node_modules ./node_modules
COPY --chown=nestjs:nodejs --from=prunner /usr/src/app/package*.json ./
COPY --chown=nestjs:nodejs --from=build /usr/src/app/dist ./dist
COPY --chown=nestjs:nodejs --from=prunner /usr/src/app/prisma ./prisma

# Switch to non-root user for security
USER nestjs

EXPOSE 4000

# Run migrations and start application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]