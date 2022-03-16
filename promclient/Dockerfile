FROM test-grafana-prometheus_base AS builder

COPY package*.json ./
RUN yarn
COPY . .

EXPOSE 5555-5556

CMD ["yarn", "start"]