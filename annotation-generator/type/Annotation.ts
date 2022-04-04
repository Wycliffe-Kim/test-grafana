import * as R from 'ramda';
import AlertState from './AlertState';

export interface Annotation {
  id: number;
  dashboardId: number;
  time: number;
  timeEnd: number;
  tags: string[];
  text: string;
  state: AlertState;
}

export namespace Annotation {
  export const defaultValue = (): Annotation => ({
    id: 0,
    dashboardId: 0,
    time: 0,
    timeEnd: 0,
    tags: [],
    text: '',
    state: "NORMAL"
  });

  export const isValid = (annotation: Annotation) => 
    annotation.id > 0 && annotation.dashboardId > 0 && 
    annotation.time > 0 && annotation.timeEnd > 0;

  export const copy = (annotation: Annotation) => R.clone(annotation);
}