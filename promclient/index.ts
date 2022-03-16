import { GRPCServer, NodeServer } from './servers';

const port = 5555;
const servers = [NodeServer, GRPCServer];
servers.forEach((server, i) => server(port + i).do());