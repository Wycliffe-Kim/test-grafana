import { Counter, register } from 'prom-client';
import MetricTypes from './MetricTypes';

export default function TrafficVolumes(type: MetricTypes) {
  const _type = type.toLowerCase();

  function getCounter(camera_number: number, minutes: number) {
    const _counter = register.getSingleMetric(`traffic_volumes_${_type}`) as Counter<string>;
    return _counter.labels(`${camera_number}`, `${minutes}`);
  }

  async function check() {
    const _dataForCheck = await register.getSingleMetricAsString(`traffic_volumes_${_type}`);
    console.log('-----------------------');
    console.log('check traffic volumes metric', _dataForCheck);
    console.log('-----------------------');
  }

  return {
    inc(camera_number: number, minutes: number, count: number) {
      getCounter(camera_number, minutes).inc(count);
      // check();
    },
  }
}