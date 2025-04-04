FROM node:20-alpine AS base

RUN apk add --no-cache openjdk17-jre

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD npm run dev
