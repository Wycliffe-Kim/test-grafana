import { Gauge, register } from 'prom-client';

export const GaugeRunner =
  <T extends {}>(name: string) =>
  () => {
    const getGauge = (input: T) => {
      const gauge = register.getSingleMetric(name) as Gauge<string>;
      return gauge.labels(...Object.keys(input));
    };

    return {
      inc: (input: T, amount: number) => getGauge(input).inc(amount),
      dec: (input: T, amount: number) => getGauge(input).dec(amount),
    };
  };
