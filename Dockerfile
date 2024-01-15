FROM node:alpine as build

USER node

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install

COPY --chown=node:node . .
RUN npm run build

CMD [ "node", "dist/main.js" ]
