FROM node:22-alpine

RUN apk add chromium

USER node

RUN npm i -g yarn
COPY package* .
RUN yarn install

COPY ./public ./public
COPY ./dist ./dist

CMD [ "node", "dist/main.js" ]
