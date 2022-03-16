import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

interface ResponseType {
  status_code: number;  
}

export default function GRPCServer(port: number) {
  const _address = '0.0.0.0';
  const _port = port;
  const _protoPath = '../proto/traffic-volumes.proto';

  function packageDefinition(protoFile: string) {
    return protoLoader.loadSync(
      protoFile,
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      }
    );
  }

  function proto(protoPath: string): any {
    return grpc.loadPackageDefinition(packageDefinition(protoPath));
  }

  function sendTrafficVolumes(
    call: any, 
    callback: grpc.sendUnaryData<ResponseType>) {
      console.log('sendTrafficVolumes', call);
      callback(null, { status_code: 1 });
    }

  return {
    do() {
      const server = new grpc.Server();
      server.addService(proto(_protoPath).TrafficVolumeService.service, { 
        send_traffic_volumes: sendTrafficVolumes 
      });
      server.bindAsync(
        `${_address}:${_port}`, 
        grpc.ServerCredentials.createInsecure(), 
        () => {
          console.log(`gRPC server started in port ${_port}`);
          server.start();
        });
    }
  }
}