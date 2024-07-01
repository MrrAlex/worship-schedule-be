FROM node:22-alpine

RUN apk add chromium

USER node

RUN npm i yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY ./public ./public
COPY ./dist ./dist

CMD [ "node", "dist/main.js" ]
