import * as R from 'ramda';
import { Function } from 'ts-toolbelt';
import axios, { AxiosResponse } from 'axios';
import { Alert, AlertMapType, Annotation } from './type';
import { WorkerAction } from './WorkerAction';
import AlertStore from './AlertStore';
import { eitherCreator, withLog } from './functions';
import * as setting from '../setting.json';

const AnnotationPusher: WorkerAction.WorkerFunc = (emitter) => {
  type AnnotationApiFunc = (annotation: Annotation) => Promise<AxiosResponse<any, any>>;
  type ToAnnotationFunc = (alert: Alert, dashboardId: number) => Annotation;
  type LogFunc = (alert: Alert) => void;
  type SearchDashboardFunc = (name: string) => Promise<number>;

  const _emitter = emitter;
  const _address = setting.address;
  const _port = setting.grafanaPort;
  const _realAddress = `http://${_address}:${_port}/api`;
  const _apiKey = `Bearer ${Buffer.from(setting.apiKey, 'base64').toString()}`;

  const start: WorkerAction.StartFunc = () => {
    _emitter.on('alert', (alerts: AlertMapType) => {
      // console.log('----------------------------------');
      // console.log(JSON.stringify(alerts));]

      const doJob = (dashboardId: number) => {
        const eitherAlertStateFiring = (alert: Alert, annotation: Annotation) => 
          eitherCreator(alert.state === 'FIRING', annotation, annotation);

        const mapEitherAlertStateFiring = (annotation: Annotation) => 
          withLog(() => putAnnotation({
            id: annotation.id,
            dashboardId: annotation.dashboardId,
            state: annotation.state,
            tags: annotation.tags,
            text: annotation.text,
            time: annotation.time,
            timeEnd: Date.now()
          }), `----- AnnotationPusher PUT ----- id: ${annotation.id}`);

        const leftMapEitherAlertStateFiring = R.curry((alert: Alert, annotation: Annotation) => 
          AlertStore.of().reset(alert.type));

        const eitherAlertStoreHas = (alert: Alert) => eitherCreator(
          AlertStore.of().has(alert.type), 
          AlertStore.of().get(alert.type), 
          toAnnotation(alert, dashboardId));

        const mapEitherAlertStoreHas = R.curry((alert: Alert, annotation: Annotation) => 
          eitherAlertStateFiring(alert, annotation)
          .map(mapEitherAlertStateFiring)
          .leftMap(leftMapEitherAlertStateFiring(alert)));

        const eitherAnnotationStateFiring = (annotation: Annotation) =>
          eitherCreator(annotation.state === 'FIRING', annotation, annotation);

        const mapEitherAnnotationStateFiring = R.curry((alert: Alert, annotation: Annotation) => 
          withLog(() => 
            postAnnotation(annotation)
            .then((response) => {
              console.log('----- Annotation POST complete -----', response.data.id);
              annotation.id = response.data.id;
              AlertStore.of().push(alert.type, annotation);
            })
            .catch((error) => console.log(error))
            , '----- AnnotationPusher POST -----'));

        const leftMapEitherAlertStoreHas = R.curry((alert: Alert, annotation: Annotation) => 
          eitherAnnotationStateFiring(annotation)
          .map(mapEitherAnnotationStateFiring(alert)));

        Object.values(alerts).forEach((alert) => {
          // log(alert);
          eitherAlertStoreHas(alert)
          .map(mapEitherAlertStoreHas(alert))
          .leftMap(leftMapEitherAlertStoreHas(alert));
        });
      }
      
      searchDashboard('Traffic Volumes').then(doJob);
    });
  }

  const postAnnotation: AnnotationApiFunc = (annotation) => 
    axios.post(`${_realAddress}/annotations`, {
      dashboardId: annotation.dashboardId,
      tags: annotation.tags,
      text: annotation.text,
      time: annotation.time,
      timeEnd: annotation.timeEnd
    }, {
      headers: {
        Authorization: _apiKey
      }
    });

  const putAnnotation: AnnotationApiFunc = (annotation) => 
    axios.put(`${_realAddress}/annotations/${annotation.id}`, {
      dashboardId: annotation.dashboardId,
      tags: annotation.tags,
      text: annotation.text,
      time: annotation.time,
      timeEnd: annotation.timeEnd
    }, {
      headers: {
        Authorization: _apiKey
      }
    });

  const searchDashboard: SearchDashboardFunc = (name) => 
    axios.get(`${_realAddress}/search`, {
      headers: {
        Authorization: _apiKey
      }
    })
    .then((response) => response.data)
    .then((dashboards: any[]) => {
      const dashboardIds = dashboards
        .filter((dashboard) => dashboard.title === name)
        .map((dashboard) => dashboard.id as number);
      return dashboardIds.length > 0 ? dashboardIds[0] : 0;
    });
  
  const log: LogFunc = (alert) => {
    if (alert.state === 'FIRING') {
      console.log(alert);
    }
  }

  const toAnnotation: ToAnnotationFunc = (alert, dashboardId) => ({
    id: 0,
    dashboardId,
    state: alert.state,
    tags: [alert.tags],
    time: alert.activeAt,
    timeEnd: alert.activeAt,
    text: alert.description,
  });

  return {
    start
  }
} 

export default AnnotationPusher;