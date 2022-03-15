import express from 'express';
import { register } from 'prom-client';

export default function NodeServer(port: number) {
  const _port = port;

  return {
    do() {
      const server = express();
    
      server.get('/trafficvolumes', async (req, res) => {
        res.set('Content-Type', register.contentType);
        res.end(await register.getSingleMetricAsString('traffic_volumes'));
      });
    
      server.listen(_port, () => {
        console.log(`metric server started in port ${_port}`);
      });
    }
  }
}