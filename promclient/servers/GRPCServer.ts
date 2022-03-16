import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { TrafficVolumes } from '../metrics';

interface RequestType {
  camera_number: number;
  minutes: number;
  car: number;
  bus: number;
  truck: number;
  motorcycle: number;
}
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
    call: grpc.ServerUnaryCall<RequestType, ResponseType>, 
    callback: grpc.sendUnaryData<ResponseType>) {
      console.log(`traffic volumes received ${JSON.stringify(call.request)}`);
      const _camera_number = call.request.camera_number;
      const _minutes = call.request.minutes;
      const _car = call.request.car;
      const _bus = call.request.bus;
      const _truck = call.request.truck;
      const _motorcycle = call.request.motorcycle;
      TrafficVolumes('CAR').inc(_camera_number, _minutes, _car);
      TrafficVolumes('BUS').inc(_camera_number, _minutes, _bus);
      TrafficVolumes('TRUCK').inc(_camera_number, _minutes, _truck);
      TrafficVolumes('MOTORCYCLE').inc(_camera_number, _minutes, _motorcycle);
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