import _ from 'lodash';
import { AlertType, Annotation } from './type';

export default class AlertStore {
  private static instance: AlertStore | null = null;

  static of = (): AlertStore => {
    this.instance = this.instance === null ? new AlertStore() : this.instance;
    return this.instance;
  }

  private alerts: Map<AlertType, Annotation>;
  
  private constructor() {
    this.alerts = new Map<AlertType, Annotation>();
    this.alerts.set('CAR', Annotation.defaultValue());
    this.alerts.set('BUS', Annotation.defaultValue());
    this.alerts.set('TRUCK', Annotation.defaultValue());
    this.alerts.set('MOTORCYCLE', Annotation.defaultValue());
  }
  
  push = (type: AlertType, annotation: Annotation) => {
    this.alerts.set(type, Annotation.copy(annotation));
  }

  get = (type: AlertType): Annotation => {
    const annotation = this.alerts.get(type);
    return annotation !== undefined ? annotation : Annotation.defaultValue();
  }

  has = (type: AlertType): boolean => Annotation.isValid(this.get(type));
}