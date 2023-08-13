FROM node:alpine as build

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install

COPY --chown=node:node . .
RUN npm run build


FROM node:alpine As production

USER node
ENV NODE_ENV production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "npm", "start" ]
