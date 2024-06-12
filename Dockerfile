FROM node:22-slim as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN npm run build


FROM node:22-slim As production

RUN apt-get update && apt-get install wget gnupg -y \
  && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor | tee /etc/apt/trusted.gpg.d/google.gpg >/dev/null \
  && echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | tee /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

USER node

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/template ./template
COPY --chown=node:node --from=build /usr/src/app/public ./public

CMD [ "node", "dist/main.js" ]
