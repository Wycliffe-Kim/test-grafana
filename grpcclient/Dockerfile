FROM test-grafana-prometheus_base AS builder

COPY package*.json ./
RUN yarn
COPY . .

CMD ["yarn", "start"]