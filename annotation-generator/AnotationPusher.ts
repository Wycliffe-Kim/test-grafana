import axios from 'axios';
import EventEmitter from 'events';
import { Alert, Annotation } from './type';
import WorkerAction from './WorkerAction';
import AlertStore from './AlertStore';
import { eitherCreator } from './functions';
import * as setting from '../setting.json';

const AnnotationPusher = (emitter: EventEmitter): WorkerAction => {
  const _emitter = emitter;
  const _address = setting.address;
  const _port = setting.grafanaPort;
  const _realAddress = `http://${_address}:${_port}/api/annotations`;
  const _apiKey = `Bearer ${setting.apiKey}`;

  const start = () => _emitter.on('alert', (alerts: Alert[]) => {
    console.log('----------------------------------');
    console.log(JSON.stringify(alerts));

    alerts.forEach((alert) => {
      eitherCreator(AlertStore.of().has(alert.type), 
        AlertStore.of().get(alert.type), toAnnotation(alert))
      .map((annotation) => 
        eitherCreator(alert.state === 'FIRING', annotation, annotation)
        .map((annotation) => put({
            id: annotation.id,
            state: annotation.state,
            tags: annotation.tags,
            text: annotation.text,
            time: annotation.time,
            timeEnd: alert.activeAt
          })))
      .leftMap((annotation) => 
        eitherCreator(annotation.state === 'FIRING', annotation, annotation)
        .map((annotation) => post(annotation).then((response) => {
          annotation.id = response.data.id;
          AlertStore.of().push(alert.type, annotation);
        }).catch((error) => console.log(error))));
    });
  });

  const post = (annotation: Annotation) => 
    axios.post(_realAddress, {
      tags: annotation.tags,
      text: annotation.text,
      time: annotation.time,
      timeEnd: annotation.timeEnd
    }, {
      headers: {
        Authorization: _apiKey
      }
    });

  const put = (annotation: Annotation) => 
    axios.put(`${_realAddress}/${annotation.id}`, {
      tags: annotation.tags,
      text: annotation.text,
      time: annotation.time,
      timeEnd: annotation.timeEnd
    }, {
      headers: {
        Authorization: _apiKey
      }
    });

  const toAnnotation = (alert: Alert): Annotation => ({
    id: 0,
    state: alert.state,
    tags: [alert.tags],
    time: alert.activeAt,
    timeEnd: alert.activeAt,
    text: alert.description
  });

  return {
    start
  }
} 

export default AnnotationPusher;