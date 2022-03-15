import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

interface ResponseType {
  status_code: number;  
}

export default function GRPCServer(port: number) {
  const _address = '0.0.0.0';
  const _port = port;
  const _protoPath = '../../proto/traffic-volumes.proto';

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

  function proto(): any {
    return grpc.loadPackageDefinition(packageDefinition(_protoPath));
  }

  function sendTrafficVolumes(
    call: grpc.ServerUnaryCall<null, ResponseType>, 
    callback: grpc.sendUnaryData<ResponseType>) {
      console.log('sendTrafficVolumes', call);
      callback(null, { status_code: 1 });
    }

  return {
    do() {
      const server = new grpc.Server();
      server.addService(proto().TrafficVolumeService, { sendTrafficVolumes })
      server.bindAsync(
        `${_address}:${_port}`, 
        grpc.ServerCredentials.createInsecure(), 
        () => server.start());
    }
  }
}