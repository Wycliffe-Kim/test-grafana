# FROM test-grafana-prometheus_base AS builder

# COPY package*.json ./
# RUN yarn

# EXPOSE 5555-5556

# CMD ["yarn", "start"]

FROM node:14-alpine

WORKDIR /usr/app
RUN mkdir /usr/proto

COPY ./proto/traffic-volumes.proto /usr/proto/
COPY ./setting.json /usr/

COPY ./promclient/package*.json ./
RUN yarn
COPY ./promclient ./

CMD ["yarn", "start"]