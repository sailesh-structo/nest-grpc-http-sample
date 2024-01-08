import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ST32Module } from './st32/st32.module';
import { MetricsModule } from './metrics/metrics.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RemoteActionsModule } from './remote-actions/remote-actions.module';

@Module({
  imports: [
    ST32Module,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    MetricsModule,
    RemoteActionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
