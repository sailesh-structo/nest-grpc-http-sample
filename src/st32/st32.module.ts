import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MachineActionsController } from './machine-actions.controller';
import { join } from 'path';
import { MachineActionsService } from './machine-actions.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CORE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auroracore',
          protoPath: join(__dirname, './protos/core.proto'),
          url: 'localhost:50052',
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
          },
        },
      },
    ]),
  ],
  providers: [MachineActionsService],
  controllers: [MachineActionsController],
})
export class ST32Module {}
