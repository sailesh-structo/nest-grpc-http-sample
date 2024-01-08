import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Controller('metrics')
export class MetricsController {
  // @OnEvent('**')
  // handleAllEvents(payload) {
  //   console.log('Metrics', payload);
  // }
}
