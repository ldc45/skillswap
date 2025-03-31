FROM node:lts-alpine

WORKDIR /usr/src/app
# package-lock.json peuvent avoir des dépendance liées à l'hôte
COPY package.json ./

RUN npm install

#COPY prisma ./prisma/
#RUN npx prisma generate

COPY ./ ./

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
#CMD ["npm", "run", "docker:dev"]
