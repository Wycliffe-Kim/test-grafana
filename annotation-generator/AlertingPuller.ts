import axios from 'axios';
import { WorkerAction } from './WorkerAction';
import * as setting from '../setting.json';
import { eitherCreator } from './functions';
import { Alert } from './type';

const AlertingPuller: WorkerAction.WorkerFunc = (emitter) => {
  type EmitFunc = (eventName: string | symbol, ...args: any[]) => Promise<boolean>;
  type ParseFunc = (alert: any) => Alert;

  const _emitter = emitter;
  const _address = setting.address;
  const _port = setting.prometheusPort;

  const start: WorkerAction.StartFunc = () => {
    setInterval(() => {
      axios.get(`http://${_address}:${_port}/api/v1/alerts`)
      .then((response) => response.data.data.alerts)
      .then((alerts: any[]) => {
        eitherCreator(alerts.length > 0, alerts, alerts)
        .map((alerts) => {
          const _alerts = alerts.map((alert) => parse(alert));
          console.log('--------------- AlertPuller ---------------');
          console.log(JSON.stringify(_alerts));
          emit('alert', _alerts);
        })
      })
      .catch((error) => {
        console.log('--------------- AlertPuller Error ---------------');
        console.log(error);
      });
    }, 1000);
  }

  const emit: EmitFunc = async (eventName, args) => {
    const result = await _emitter.emit(eventName, args);
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

  return {
    start
  }
} 

export default AlertingPuller;