FROM node:lts-alpine AS base

# Step 1: Development dependencies
FROM base AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# Step 2: Development environment
FROM deps AS dev
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
EXPOSE 4000
CMD ["npm", "run", "docker:dev"]

# Step 3: Build for production
FROM deps AS build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

# Step 4: Production image
FROM base AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
RUN npx prisma generate
EXPOSE 400
CMD ["npm", "run", "start:prod"]
