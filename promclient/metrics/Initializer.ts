import { Counter } from 'prom-client';
import MetricTypes from './MetricTypes';

export default function Initializer() {
  function createCounter(type: MetricTypes) {
    const _type = type.toLowerCase();
    new Counter({
      name: `traffic_volumes_${_type}`,
      help: `Traffic Volumes Metrics (${_type}) For Test`,
      labelNames: ['camera_number']
    });
  }

  return {
    do() {
      createCounter('CAR');
      createCounter('BUS');
      createCounter('TRUCK');
      createCounter('MOTORCYCLE');
    }
  }
}