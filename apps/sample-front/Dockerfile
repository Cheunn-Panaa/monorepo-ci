# build stage
FROM node:20.5.0 AS build
RUN apt update && apt-get install -y --no-install-recommends dumb-init
WORKDIR /usr/src/app
COPY apps/coop-back/package*.json /usr/src/app/
RUN yarn install

# production stage
FROM node:20.5.0-bullseye-slim
RUN npm install --global tsx
ENV NODE_ENV production
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node apps/coop-back /usr/src/app
CMD ["dumb-init", "yarn", "start"]
