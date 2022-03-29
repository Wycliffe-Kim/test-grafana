import { Counter } from 'prom-client';

export default function Initializer() {
  function createCounter() {
    new Counter({
      name: 'traffic_volumes',
      help: 'Traffic Volumes Metrics For Test',
      labelNames: ['metric_type', 'camera_number']
    });
  }

  return {
    do() {
      createCounter();
    }
  }
}