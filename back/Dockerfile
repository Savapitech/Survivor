FROM node:26

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm i

EXPOSE ${PORT:-3000}

CMD ["npm", "run", "start"]
