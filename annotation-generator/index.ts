import EventEmitter from 'events';
import AlertingPuller from './AlertingPuller';
import AnnotationPusher from './AnotationPusher';

const main = () => {
  const emitter = new EventEmitter();
  const workers = [
    // AnnotationPusher, 
    AlertingPuller
  ];
  workers.map((worker) => worker(emitter).start());
}

main();