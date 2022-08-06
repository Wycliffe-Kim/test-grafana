import { Counter, Gauge } from 'prom-client';

export function Initializer() {
  function createCounter() {
    new Counter({
      name: 'traffic_volumes',
      help: 'Traffic Volumes Metrics For Test',
      labelNames: ['metric_type', 'camera_number'],
    });

    new Gauge({
      name: 'traffic_counters',
      help: 'Traffic Counters',
      labelNames: [
        'cameraId',
        'flowType',
        'id',
        'instance',
        'job',
        'linkId',
        'objectType',
        'siteId',
        'type',
      ],
    });

    new Gauge({
      name: 'traffic_gauges',
      help: 'Traffic Gauges',
      labelNames: [
        'cameraId',
        'flowType',
        'id',
        'instance',
        'job',
        'linkId',
        'objectType',
        'siteId',
        'type',
        'valType',
      ],
    });
  }

  return {
    do() {
      createCounter();
    },
  };
}
