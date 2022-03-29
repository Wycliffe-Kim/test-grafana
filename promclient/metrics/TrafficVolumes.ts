import { Counter, register } from 'prom-client';
import MetricTypes from './MetricTypes';

export default function TrafficVolumes(type: MetricTypes) {
  const _type = type.toLowerCase();

  function getCounter(camera_number: number) {
    const _counter = register.getSingleMetric('traffic_volumes') as Counter<string>;
    return _counter.labels(_type, `${camera_number}`);
  }

  return {
    inc(camera_number: number, count: number) {
      getCounter(camera_number).inc(count);
    },
  }
}