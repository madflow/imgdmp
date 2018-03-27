FROM node:8-alpine

RUN apk add --no-cache tini

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--", "yarn", "start"]