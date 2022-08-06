import { Initializer, Simulator } from './metrics';
import { GRPCServer, NodeServer } from './servers';
import * as setting from '../setting.json';

const initMetrics = () => {
  Initializer().do();
};

const startServers = () => {
  const port = setting.promClientPort;
  const servers = [NodeServer, GRPCServer];
  servers.forEach((server, i) => server(port + i).do());
};

const startSimulator = () => {
  Simulator().doTrafficCounters();
  Simulator().doTrafficGauges();
};

initMetrics();
startServers();
startSimulator();
