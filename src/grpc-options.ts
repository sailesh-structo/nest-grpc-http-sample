import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'auroracore', // ['hero', 'hero2']
    protoPath: join(__dirname, './core/protos/core.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
  },
};
