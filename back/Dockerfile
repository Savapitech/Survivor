FROM node:26-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json package-lock.json ./


RUN npm i

COPY . .

EXPOSE ${PORT:-3000}

CMD ["npm", "run", "start"]
