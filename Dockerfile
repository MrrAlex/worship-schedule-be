FROM node:22-slim as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN npm run build


FROM node:22-alpine As production

RUN apk add chromium

USER node

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/template ./template
COPY --chown=node:node --from=build /usr/src/app/public ./public

CMD [ "node", "dist/main.js" ]
