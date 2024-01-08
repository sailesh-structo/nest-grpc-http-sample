import { Module } from '@nestjs/common';
import { RemoteActionsController } from './remote-actions.controller';

@Module({
  controllers: [RemoteActionsController],
})
export class RemoteActionsModule {}
