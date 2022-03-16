import { Initializer } from './metrics';
import { GRPCServer, NodeServer } from './servers';

function initMetrics() {
  Initializer().do();
}

function startServers() {
  const port = 5555;
  const servers = [NodeServer, GRPCServer];
  servers.forEach((server, i) => server(port + i).do());
}

initMetrics();
startServers();