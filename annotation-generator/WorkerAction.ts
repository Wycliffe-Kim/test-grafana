import EventEmitter from "events";

export interface WorkerAction {
  start: WorkerAction.StartFunc;
}

export namespace WorkerAction {
  export type WorkerFunc = (emitter: EventEmitter) => WorkerAction;
  export type StartFunc = () => void;
}