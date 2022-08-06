import { TrafficCounters, TrafficGauges } from '../@types';
import { generateRandomNumber } from '../functions';
import { TrafficCountersRunner } from './TrafficCountersRunner';
import { TrafficGaugesRunner } from './TrafficGuagesRunner';

export const Simulator = () => {
  return {
    doTrafficCounters: () => {
      setInterval(() => {
        const input = TrafficCounters.random();
        const inc = Math.round(generateRandomNumber(0, 1));
        const amout = generateRandomNumber(0, 10);
        inc === 0
          ? TrafficCountersRunner().inc(input, amout)
          : TrafficCountersRunner().dec(input, amout);
      }, 1000);
    },
    doTrafficGauges: () => {
      setInterval(() => {
        const input = TrafficGauges.random();
        const inc = generateRandomNumber(0, 1);
        const amout = generateRandomNumber(0, 10);
        inc === 0
          ? TrafficGaugesRunner().inc(input, amout)
          : TrafficGaugesRunner().dec(input, amout);
      }, 1000);
    },
  };
};
