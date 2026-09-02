FROM node:26 AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

FROM nginx

WORKDIR /usr/share/nginx/

COPY --from=builder /usr/src/app/dist ./html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
