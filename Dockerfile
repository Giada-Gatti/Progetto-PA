FROM node:18

RUN npm install -g npm@7

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "start"]