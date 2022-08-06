import _ from 'lodash';
import { generateRandomNumber } from '../functions';
import { FlowType } from './FlowType';

export type TrafficCounters = {
  cameraId: string;
  flowType: FlowType;
  id: string;
  instance: string;
  job: string;
  linkId: string;
  objectType: string;
  siteId: string;
  type: 'crossing';
};

export namespace TrafficCounters {
  export const random = (): TrafficCounters => {
    const cameraIds = _.range(4).map((i) => `camera${i}`);
    const flowTypes: FlowType[] = ['OUTFLOW', 'INFLOW'];
    const ids = _.range(4).map((i) => `id${i}`);
    const instances = _.range(4).map((i) => `instance${i}`);
    const jobs = _.range(4).map((i) => `job${i}`);
    const linkIds = _.range(8).map((i) => `link${i}`);
    const objectTypes = _.range(10).map((i) => `object${i}`);
    const siteIds = _.range(5).map((i) => `site${i}`);

    return {
      cameraId: cameraIds[generateRandomNumber(0, cameraIds.length - 1)],
      flowType: flowTypes[generateRandomNumber(0, flowTypes.length - 1)],
      id: ids[generateRandomNumber(0, ids.length - 1)],
      instance: instances[generateRandomNumber(0, instances.length - 1)],
      job: jobs[generateRandomNumber(0, jobs.length - 1)],
      linkId: linkIds[generateRandomNumber(0, linkIds.length - 1)],
      objectType: objectTypes[generateRandomNumber(0, objectTypes.length - 1)],
      siteId: siteIds[generateRandomNumber(0, siteIds.length - 1)],
      type: 'crossing',
    };
  };
}
