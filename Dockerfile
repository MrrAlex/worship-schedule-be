FROM node:22-alpine As production

RUN apk add chromium

USER node

COPY ./node_modules ./node_modules
COPY ./dist ./dist
COPY ./public ./public

CMD [ "node", "dist/main.js" ]
