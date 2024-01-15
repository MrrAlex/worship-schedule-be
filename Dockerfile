FROM node:alpine as build

USER node

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install

COPY --chown=node:node . .
RUN npm run build


FROM node:alpine As production

USER node

COPY --chown=node:node --from=build /home/node/.cache/puppeteer /home/node/.cache/puppeteer
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/template ./template

CMD [ "node", "dist/main.js" ]
