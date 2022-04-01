# FROM test-grafana-prometheus_base AS builder

# COPY package*.json ./
# RUN yarn
# COPY . .

# CMD ["yarn", "start"]

FROM node:14-alpine

WORKDIR /usr/app
RUN mkdir /usr/proto

COPY ./proto/traffic-volumes.proto /usr/proto/
COPY ./setting.json /usr/

COPY ./grpcclient/package*.json ./
RUN yarn
COPY ./grpcclient ./

CMD ["yarn", "start"]