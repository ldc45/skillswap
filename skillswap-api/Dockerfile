FROM node:lts-alpine

WORKDIR /usr/src/app
# package-lock.json can have host-related dependencies
COPY package.json ./

RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY ./ ./

EXPOSE 4000

#CMD ["npm", "run", "start:dev"]
CMD ["npm", "run", "docker:dev"]
