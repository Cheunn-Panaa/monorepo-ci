FROM node:20.5.0-alpine

WORKDIR /opt/microsvc

RUN apk update
RUN apk --no-cache add curl

COPY --chown=node:node . .
RUN chown -R node:node ./
USER node
RUN yarn

CMD ["yarn"]
