import AlertState from './AlertState';
import AlertType from './AlertType';

export interface Alert {
  type: AlertType;
  activeAt: number;
  alertName: string;
  job: string;
  instance: string;
  tags: string;
  cameraNumber: number;
  summary: string;
  description: string;
  value: string;
  state: AlertState
}

export namespace Alert {
  export const defaultValue = (defaultType: AlertType = 'CAR'): Alert => ({
    type: defaultType,
    activeAt: 0,
    alertName: '',
    job: '',
    instance: '',
    tags: '',
    cameraNumber: 0,
    summary: '',
    description: '',
    value: '',
    state: 'NORMAL'
  });

  export const isValid = (alert: Alert) => alert.alertName.length > 0 && alert.activeAt > 0;
}