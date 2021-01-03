FROM node:12 AS build
WORKDIR /
COPY package.json yarn.lock ./
RUN yarn install --production
COPY ./bin ./bin
CMD ["node", "./bin/index.js"]
