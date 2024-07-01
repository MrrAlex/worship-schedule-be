FROM node:22-alpine As production

RUN apk add chromium

USER node

RUN npm i -g yarn
COPY package* .
RUN yarn install

COPY ./node_modules ./node_modules
COPY ./public ./public

CMD [ "node", "dist/main.js" ]
