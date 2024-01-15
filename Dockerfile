FROM node:alpine as build

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
USER node

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install

COPY --chown=node:node . .
RUN npm run build


FROM node:slim As production

USER node

RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/template ./template

CMD [ "node", "dist/main.js" ]
