# FROM test-grafana-prometheus_base AS builder

# COPY package*.json ./
# RUN yarn
# COPY . .

# CMD ["yarn", "start"]

FROM node:14-alpine

WORKDIR /usr/app
COPY ./setting.json /usr/

COPY ./annotation-generator/package*.json ./
RUN yarn
COPY ./annotation-generator ./

CMD ["yarn", "start"]