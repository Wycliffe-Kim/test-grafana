import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as setting from '../setting.json';

// const address = 'localhost';
const address = setting.address;
const port = setting.promClientPort + 1;
const protoPath = '../proto/traffic-volumes.proto';

function packageDefinition(protoFile: string) {
  return protoLoader.loadSync(protoFile, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
}

function proto(protoPath: string): any {
  return grpc.loadPackageDefinition(packageDefinition(protoPath));
}

function generateRandomNumber(max: number) {
  return parseInt((Math.random() * max).toFixed(0));
}

function main() {
  const _proto = proto(protoPath);
  const _service = new _proto.TrafficVolumeService(
    `${address}:${port}`,
    grpc.credentials.createInsecure()
  );

  setInterval(() => {
    const data = {
      camera_number: generateRandomNumber(4),
      // camera_number: 0,
      // minutes: generateRandomNumber(59),
      // minutes: 0,
      car: generateRandomNumber(5),
      bus: generateRandomNumber(5),
      truck: generateRandomNumber(5),
      motorcycle: generateRandomNumber(5),
    };
    // console.log(`traffic volumes sent: ${JSON.stringify(data)}`);
    _service.send_traffic_volumes(data, (error: any, response: any) => {});
  }, 1000);
}

main();
