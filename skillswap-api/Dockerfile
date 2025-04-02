FROM node:lts-alpine AS base

# Étape 1 : Dépendances de développement
FROM base AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# Étape 2 : Environnement de développement
FROM deps AS dev
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
EXPOSE 4000
CMD ["npm", "run", "docker:dev"]

# Étape 3 : Construction pour la production
FROM deps AS build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

# Étape 4 : Image de production
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
