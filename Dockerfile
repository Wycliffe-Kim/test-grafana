FROM node:14-alpine

WORKDIR /usr/app
RUN mkdir /usr/proto

COPY ./proto/traffic-volumes.proto /usr/proto/
