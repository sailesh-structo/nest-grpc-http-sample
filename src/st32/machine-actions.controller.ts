import {
  Controller,
  Inject,
  Get,
  Res,
  Query,
  Body,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, interval, map, merge } from 'rxjs';
import { Response } from 'express';
import {
  MachineActionsService,
  MachineEventWithPayload,
} from './machine-actions.service';

type SseObserverParams = {
  apiObserver: Observable<MachineEventWithPayload>;
  response: Response;
};

@Controller('st32')
export class MachineActionsController {
  constructor(
    @Inject('CORE_PACKAGE') private readonly client: ClientGrpc,
    private machineActionsService: MachineActionsService,
  ) {}

  wrapSseObserver = ({ apiObserver, response }: SseObserverParams) => {
    const observer = {
      next: (msg: MachineEventWithPayload) => {
        // if (msg.type) response.write(`event: ${msg.type}\n`);
        // if (msg.id) response.write(`id: ${msg.id}\n`);
        // if (msg.retry) response.write(`retry: ${msg.retry}\n`);
        response.write(`event: message\n`);
        response.write(`data: ${JSON.stringify(msg)}\n\n`);
      },
      complete: () => {
        console.log(`${name} observer.complete`);
      },
      error: (err: any) => {
        console.log(`${name} observer.error: ${err}`);
      },
    };

    // Handle connection closed
    response.on('close', () => {
      console.log(`Closing connection`);
      response.end(); // Close connection
    });

    // Send headers to establish SSE connection
    response.set({
      'Cache-Control':
        'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });
    response.flushHeaders();

    return apiObserver.subscribe(observer);
  };

  @Get('sse')
  sse(@Res() response: Response) {
    const backendHeartbeat$ = interval(5000).pipe(
      map(() => {
        const eventData: MachineEventWithPayload = {
          payload: Date.now(),
          error: null,
          type: 'BE_HEARTBEAT',
        };
        return eventData;
      }),
    );
    this.machineActionsService.streamActions().subscribe();
    const machineActions$ = this.machineActionsService.getMachineActions$();

    const frontendObserver = merge(backendHeartbeat$, machineActions$);

    return this.wrapSseObserver({
      apiObserver: frontendObserver,
      response,
    });
  }

  @Get('connectToBackend')
  connectToBackend() {
    return this.machineActionsService.connectToBackend();
  }

  @Get('initialise')
  initialise() {
    return this.machineActionsService.initialise();
  }

  @Get('raisePlatform')
  raisePlatform() {
    return this.machineActionsService.raisePlatform();
  }

  @Post('addJobs')
  addJobs(@Body() body) {
    const { files } = body;
    return this.machineActionsService.addJobs(files);
  }

  @Get('removeJob')
  removeJob(@Query() queryParams) {
    const { jobId } = queryParams;
    return this.machineActionsService.removeJob(jobId);
  }

  @Get('doReset')
  doReset() {
    return this.machineActionsService.doReset();
  }

  @Get('startPrint')
  startPrint() {
    return this.machineActionsService.startPrint();
  }

  @Get('cycleStop')
  cycleStop() {
    return this.machineActionsService.cycleStop();
  }
}
