FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server/server.js ./server.js
COPY src /app/src

EXPOSE 3000
USER node

CMD ["node", "server.js"]