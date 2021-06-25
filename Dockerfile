FROM node:14-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json ./src ./
RUN yarn install && yarn build
COPY ./bin ./bin
CMD ["yarn", "deploy"]
