import { Initializer } from './metrics';
import { GRPCServer, NodeServer } from './servers';
import * as setting from '../setting.json';

function initMetrics() {
  Initializer().do();
}

function startServers() {
  const port = setting.promClientPort;
  const servers = [NodeServer, GRPCServer];
  servers.forEach((server, i) => server(port + i).do());
}

initMetrics();
startServers();