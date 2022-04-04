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
    this.reset('CAR');
    this.reset('BUS');
    this.reset('TRUCK');
    this.reset('MOTORCYCLE');
  }
  
  push = (type: AlertType, annotation: Annotation) => {
    this.alerts.set(type, Annotation.copy(annotation));
  }

  get = (type: AlertType): Annotation => {
    const annotation = this.alerts.get(type);
    return annotation !== undefined ? annotation : Annotation.defaultValue();
  }

  has = (type: AlertType): boolean => Annotation.isValid(this.get(type));

  reset = (type: AlertType) => {
    this.alerts.set(type, Annotation.defaultValue());
  }
}