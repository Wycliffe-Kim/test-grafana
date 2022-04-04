import axios from 'axios';
import { WorkerAction } from './WorkerAction';
import * as setting from '../setting.json';
import { Alert, AlertMapType } from './type';

const AlertingPuller: WorkerAction.WorkerFunc = (emitter) => {
  type AlertMapFunc = () => AlertMapType;
  type EmitFunc = (eventName: string | symbol, alerts: AlertMapType) => Promise<boolean>;
  type ParseFunc = (alert: any) => Alert;
  type LogFunc = (alert: Alert) => void;

  const _emitter = emitter;
  const _address = setting.address;
  const _port = setting.prometheusPort;

  const start: WorkerAction.StartFunc = () => {
    setInterval(() => {
      axios.get(`http://${_address}:${_port}/api/v1/alerts`)
      .then((response) => response.data.data.alerts as any[])
      .then((alerts) => {
        const _alerts = alertMap();
          
        // console.log('--------------- AlertPuller ---------------');
        alerts.map((alert) => parse(alert)).forEach((alert) => {
          _alerts[alert.type] = alert;
        });
        // log(_alerts.CAR);
        // log(_alerts.BUS);
        // log(_alerts.TRUCK);
        // log(_alerts.MOTORCYCLE);
        emit('alert', _alerts);
      })
      .catch((error) => {
        console.log('--------------- AlertPuller Error ---------------');
        console.log(error);
      });
    }, 200);
  }

  const emit: EmitFunc = async (eventName, alerts) => {
    const result = await _emitter.emit(eventName, alerts);
    return result;
  }

  const parse: ParseFunc = (alert) => ({
    type: alert.labels.metric_type.toUpperCase(),
    alertName: alert.labels.alertname,
    cameraNumber: parseInt(alert.labels.camera_number),
    instance: alert.labels.instance,
    job: alert.labels.job,
    tags: alert.labels.tags,
    summary: alert.annotations.summary,
    description: alert.annotations.description,
    activeAt: Date.parse(alert.activeAt),
    value: alert.value,
    state: alert.state.toUpperCase()
  });
  
  const log: LogFunc = (alert) => {
    if (alert.state === 'FIRING') {
      console.log(alert);
    }
  }

  const alertMap: AlertMapFunc = () => ({
    CAR: Alert.defaultValue('CAR'),
    BUS: Alert.defaultValue('BUS'),
    TRUCK: Alert.defaultValue('TRUCK'),
    MOTORCYCLE: Alert.defaultValue('MOTORCYCLE'),
  });

  return {
    start
  }
} 

export default AlertingPuller;