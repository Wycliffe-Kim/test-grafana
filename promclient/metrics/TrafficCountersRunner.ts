import { TrafficCounters } from '../@types';
import { GaugeRunner } from './GaugeRunner';

export const TrafficCountersRunner =
  GaugeRunner<TrafficCounters>('traffic_counters');
