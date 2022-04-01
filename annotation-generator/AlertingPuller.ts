import axios from 'axios';
import { WorkerAction } from './WorkerAction';
import * as setting from '../setting.json';
import { eitherCreator } from './functions';
import { Alert, AlertType } from './type';

const AlertingPuller: WorkerAction.WorkerFunc = (emitter) => {
  type AlertMapFunc = () => Map<AlertType, Alert>;
  type EmitFunc = (eventName: string | symbol, ...args: any[]) => Promise<boolean>;
  type ParseFunc = (alert: any) => Alert;

  const _emitter = emitter;
  const _address = setting.address;
  const _port = setting.prometheusPort;

  const start: WorkerAction.StartFunc = () => {
    setInterval(() => {
      axios.get(`http://${_address}:${_port}/api/v1/alerts`)
      .then((response) => response.data.data.alerts as any[])
      .then((alerts) => {
        eitherCreator(alerts.length > 0, alerts, alerts)
        .map((alerts) => {
          const _alertMap = alertMap();
          console.log('--------------- AlertPuller 1 ---------------');
          console.log(JSON.stringify(_alertMap), alerts);
          
          alerts.map((alert) => parse(alert)).forEach((alert) => {
            _alertMap.set(alert.type, alert);
          });
          console.log('--------------- AlertPuller 2 ---------------');
          console.log(JSON.stringify(_alertMap));
          // emit('alert', _alerts);
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

  const alertMap: AlertMapFunc = () => {
    const _alertMap = new Map<AlertType, Alert>();
    _alertMap.set('CAR', Alert.defaultValue());
    _alertMap.set('BUS', Alert.defaultValue());
    _alertMap.set('TRUCK', Alert.defaultValue());
    _alertMap.set('MOTORCYCLE', Alert.defaultValue());
    console.log('alertMap', _alertMap);
    return _alertMap;
  }

  return {
    start
  }
} 

export default AlertingPuller;