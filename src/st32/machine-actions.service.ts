import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  Subject,
  catchError,
  firstValueFrom,
  lastValueFrom,
  map,
  of,
  take,
  throwError,
  throwIfEmpty,
  timeout,
} from 'rxjs';
import {
  CoreServiceClient,
  File,
  StreamActionResponse_Type,
} from './protos/generated/src/core/protos/core';
import { EventEmitter2 } from '@nestjs/event-emitter';

const API_TIMEOUT = 30 * 1000;

export type MachineEventWithPayload = {
  payload: any;
  error: any;
  type: MachineEvent;
};

type MachineEvent =
  | 'BE_HEARTBEAT'
  | 'STREAM_ACTIONS'
  | StreamActionResponse_Type
  | 'INITIALISE'
  | 'RAISE_PLATFORM'
  | 'JOBS_ADDED'
  | 'JOBS_REMOVED'
  | 'RESET'
  | 'PRINT_STATUS'
  | 'CYCLE_STOP';

@Injectable()
export class MachineActionsService implements OnModuleInit {
  private coreService: CoreServiceClient;
  private machineActions$ = new Subject<MachineEventWithPayload>();

  constructor(
    @Inject('CORE_PACKAGE') private readonly client: ClientGrpc,
    private eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    this.coreService = this.client.getService<CoreServiceClient>('CoreService');
    this.machineActions$.subscribe({
      next: (event) => {
        this.eventEmitter.emit(`st32.${event.type}`, event.payload);
      },
      complete: () => {
        console.log('machineActions$ complete');
      },
      error: (err: any) => {
        console.log('machineActions$ error', err);
      },
    });
  }

  getMachineActions$() {
    return this.machineActions$;
  }

  connectToBackend() {
    const apiObserver = this.coreService.streamActions({}).pipe(
      take(1),
      map(() => {
        const eventData: MachineEventWithPayload = {
          payload: null,
          error: null,
          type: 'BE_HEARTBEAT',
        };
        return eventData;
      }),
      timeout(API_TIMEOUT),
      catchError((err) => {
        console.error('connectToBackend error', err);
        const errorResponse: MachineEventWithPayload = {
          error: err.message,
          payload: null,
          type: 'BE_HEARTBEAT',
        };
        return throwError(
          () =>
            new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
    );
    return apiObserver;
  }

  streamActions() {
    return this.coreService.streamActions({}).pipe(
      map((data) => {
        const eventData: MachineEventWithPayload = {
          payload: data,
          error: null,
          type: data.type,
        };
        this.machineActions$.next(eventData);
        return eventData;
      }),
      timeout(API_TIMEOUT),
      catchError((err) => {
        console.error('streamActions error', err);
        const errorResponse: MachineEventWithPayload = {
          error: err.message,
          payload: null,
          type: 'STREAM_ACTIONS',
        };
        return throwError(
          () =>
            new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
      throwIfEmpty(() => {
        console.error(
          'streamActions source completed or errored without emitting',
        );
        const errorResponse: MachineEventWithPayload = {
          error: 'SERVER_ERROR',
          payload: null,
          type: 'STREAM_ACTIONS',
        };
        return new HttpException(
          errorResponse,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  initialise() {
    const apiObserver = this.coreService.doInitializationAndScanning({}).pipe(
      map((data) => {
        const eventData: MachineEventWithPayload = {
          payload: data,
          error: null,
          type: 'INITIALISE',
        };
        this.machineActions$.next(eventData);
        return eventData;
      }),
      timeout(API_TIMEOUT),
      catchError((err) => {
        console.error('doInitializationAndScanning error', err);
        const errorResponse: MachineEventWithPayload = {
          error: err.message,
          payload: null,
          type: 'INITIALISE',
        };
        this.machineActions$.next(errorResponse);
        return throwError(
          () =>
            new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
      throwIfEmpty(() => {
        console.error(
          'doInitializationAndScanning source completed or errored without emitting',
        );
        const errorResponse: MachineEventWithPayload = {
          error: 'SERVER_ERROR',
          payload: null,
          type: 'INITIALISE',
        };
        return new HttpException(
          errorResponse,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
    return lastValueFrom(apiObserver);
  }

  raisePlatform() {
    const apiObserver = this.coreService.doRaisePlatform({}).pipe(
      map((data) => {
        const eventData: MachineEventWithPayload = {
          payload: data,
          error: null,
          type: 'RAISE_PLATFORM',
        };
        this.machineActions$.next(eventData);
        return eventData;
      }),
      timeout(API_TIMEOUT),
      catchError((err) => {
        console.error('doRaisePlatform error', err);
        const errorResponse: MachineEventWithPayload = {
          error: err.message,
          payload: null,
          type: 'RAISE_PLATFORM',
        };
        this.machineActions$.next(errorResponse);
        return throwError(
          () =>
            new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
      throwIfEmpty(() => {
        console.error(
          'doRaisePlatform source completed or errored without emitting',
        );
        const errorResponse: MachineEventWithPayload = {
          error: 'SERVER_ERROR',
          payload: null,
          type: 'RAISE_PLATFORM',
        };
        return new HttpException(
          errorResponse,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );

    return lastValueFrom(apiObserver);
  }

  addJobs(files: File[]) {
    console.log('addJobs', files);
    const apiObserver = this.coreService
      .setFile({
        files,
      })
      .pipe(
        map((data) => {
          const eventData: MachineEventWithPayload = {
            payload: data,
            error: null,
            type: 'JOBS_ADDED',
          };
          this.machineActions$.next(eventData);
          return eventData;
        }),
        timeout(API_TIMEOUT),
        catchError((err) => {
          console.error('addJobs error', err);
          const errorResponse: MachineEventWithPayload = {
            error: err.message,
            payload: null,
            type: 'JOBS_ADDED',
          };
          this.machineActions$.next(errorResponse);
          return throwError(
            () =>
              new HttpException(
                errorResponse,
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }),
        throwIfEmpty(() => {
          console.error('addJobs source completed or errored without emitting');
          const errorResponse: MachineEventWithPayload = {
            error: 'SERVER_ERROR',
            payload: null,
            type: 'JOBS_ADDED',
          };
          return new HttpException(
            errorResponse,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      );
    return lastValueFrom(apiObserver);
  }

  removeJob(jobId: string) {
    console.log('removeJob', jobId);
    const apiObserver = this.coreService
      .deleteFile({
        jobid: jobId,
      })
      .pipe(
        map((data) => {
          const eventData: MachineEventWithPayload = {
            payload: data,
            error: null,
            type: 'JOBS_REMOVED',
          };
          this.machineActions$.next(eventData);
          return eventData;
        }),
        timeout(API_TIMEOUT),
        catchError((err) => {
          console.error('removeJob error', err);
          const errorResponse: MachineEventWithPayload = {
            error: err.message,
            payload: null,
            type: 'JOBS_REMOVED',
          };
          this.machineActions$.next(errorResponse);
          return throwError(
            () =>
              new HttpException(
                errorResponse,
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }),
        throwIfEmpty(() => {
          console.error(
            'removeJob source completed or errored without emitting',
          );
          const errorResponse: MachineEventWithPayload = {
            error: 'SERVER_ERROR',
            payload: null,
            type: 'JOBS_REMOVED',
          };
          return new HttpException(
            errorResponse,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      );
    return lastValueFrom(apiObserver);
  }

  async doReset() {
    const apiObserver = this.coreService.resetPnP({}).pipe(
      take(1),
      map((data) => {
        const eventData: MachineEventWithPayload = {
          payload: data,
          error: null,
          type: 'RESET',
        };
        this.machineActions$.next(eventData);
        return eventData;
      }),
      timeout(API_TIMEOUT),
      catchError((err) => {
        console.error('resetPnP error', err);
        const errorResponse: MachineEventWithPayload = {
          error: err.message,
          payload: null,
          type: 'RESET',
        };
        this.machineActions$.next(errorResponse);
        return throwError(
          () =>
            new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
      throwIfEmpty(() => {
        console.error('resetPnP source completed or errored without emitting');
        const errorResponse: MachineEventWithPayload = {
          error: 'SERVER_ERROR',
          payload: null,
          type: 'RESET',
        };
        return new HttpException(
          errorResponse,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
    return lastValueFrom(apiObserver);
  }

  startPrint() {
    const apiObserver = this.coreService.startPrint({}).pipe(
      map((data) => {
        const eventData: MachineEventWithPayload = {
          payload: data,
          error: null,
          type: 'PRINT_STATUS',
        };
        this.machineActions$.next(eventData);
        return eventData;
      }),
      timeout(API_TIMEOUT),
      catchError((err) => {
        console.error('startPrint error', err);
        const errorResponse: MachineEventWithPayload = {
          error: err.message,
          payload: null,
          type: 'PRINT_STATUS',
        };
        this.machineActions$.next(errorResponse);
        return throwError(
          () =>
            new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
      throwIfEmpty(() => {
        console.error(
          'startPrint source completed or errored without emitting',
        );
        const errorResponse: MachineEventWithPayload = {
          error: 'SERVER_ERROR',
          payload: null,
          type: 'PRINT_STATUS',
        };
        return new HttpException(
          errorResponse,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );

    return lastValueFrom(apiObserver);
  }

  cycleStop() {
    const apiObserver = this.coreService.cycleStop({}).pipe(
      map((data) => {
        const eventData: MachineEventWithPayload = {
          payload: data,
          error: null,
          type: 'CYCLE_STOP',
        };
        this.machineActions$.next(eventData);
        return eventData;
      }),
      timeout(API_TIMEOUT),
      catchError((err) => {
        console.error('cycleStop error', err);
        const errorResponse: MachineEventWithPayload = {
          error: err.message,
          payload: null,
          type: 'CYCLE_STOP',
        };
        this.machineActions$.next(errorResponse);
        return throwError(
          () =>
            new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
      throwIfEmpty(() => {
        console.error('cycleStop source completed or errored without emitting');
        const errorResponse: MachineEventWithPayload = {
          error: 'SERVER_ERROR',
          payload: null,
          type: 'CYCLE_STOP',
        };
        return new HttpException(
          errorResponse,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );

    return lastValueFrom(apiObserver);
  }
}
