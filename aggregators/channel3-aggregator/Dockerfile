
FROM node:18-alpine3.19
WORKDIR /app

# COPY --chown=node:node . /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build
RUN npm prune --production

ENV NODE_ENV production
WORKDIR /app

# COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
# COPY --chown=node:node --from=build /usr/src/app .

EXPOSE 3000

# USER node

CMD ["npm", "run", "start:prod"]