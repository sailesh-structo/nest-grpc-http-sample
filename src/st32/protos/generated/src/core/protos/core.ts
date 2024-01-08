/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "../../../google/protobuf/timestamp";

export const protobufPackage = "auroracore";

export interface DoInitializationAndScanningResponse {
  /**
   * enum EzplateRegisterStatus
   * {
   *   UNKNOWN = 0;
   *   SCANNING_HOMING_INIT = 1;
   *   SCANNING_HOMING_BUSY = 2;
   *   SCANNING_HOMING_DONE = 3;
   *   SCANNING_BUSY = 4;
   *   SCANNING_DONE = 5;
   *   SCANNING_IDLE = 6;
   *   SCANNING_ERROR = 10;
   * }
   */
  status: string;
}

export interface MaintenanceModeRequest {
  isMaintenanceMode: boolean;
}

export interface TankCleaningRequest {
  duration: number;
}

export interface CancelPrintRequest {
  jobid: string;
}

export interface CancelPrintResponse {
  jobid: string;
  /** CANCEL_PRINT_INIT, CANCEL_PRINT_DONE */
  status: string;
  errorMessage: string;
}

export interface DoorStatus {
  isDoorOpen: boolean;
}

export interface layerInspectionCompleteRequest {
  cancelPrint: boolean;
}

export interface OperationPayload {
  status: string;
  errorMessage: string;
}

export interface StartPrintJob {
  jobid: string;
  preheatResin: boolean;
  firstLayerInspection: boolean;
}

export interface StartPrintRequestList {
  jobs: StartPrintJob[];
}

export interface StartPrintResponseStream {
  jobid: string;
  currentPrintedLayer: number;
  printStatus: string;
  /**
   * UNKNOWN
   * PRINT_RUNNING
   * PRINT_REMOVAL
   * PICKING_INIT
   * PICKING_BUSY
   * PICKING_DONE
   * PRINT_COMPLETED
   * PRINT_FAILED
   */
  availableEZPlate: number;
  PrintedEZPlate: number;
  jobsCompleted: number;
  jobsRemaining: number;
  /** only comes in after PRINT_STARTING */
  plateId: number;
}

export interface Response {
  success: boolean;
  code: number;
  message: string;
}

export interface DeleteFileRequest {
  jobid: string;
}

export interface ButtonActionStreamResponse {
  type: ButtonActionStreamResponse_Type;
  ButtonType: ButtonActionStreamResponse_ButtonActionType;
}

export enum ButtonActionStreamResponse_Type {
  BUTTON_ACTION = "BUTTON_ACTION",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export enum ButtonActionStreamResponse_ButtonActionType {
  BUTTON_IDLE = "BUTTON_IDLE",
  START_BUTTON = "START_BUTTON",
  STOP_BUTTON = "STOP_BUTTON",
  ENTER_BUTTON = "ENTER_BUTTON",
  CANCEL_BUTTON = "CANCEL_BUTTON",
  UP_BUTTON = "UP_BUTTON",
  DOWN_BUTTON = "DOWN_BUTTON",
  POWER_BUTTON = "POWER_BUTTON",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export interface StreamActionResponse {
  type: StreamActionResponse_Type;
  heartbeatStatus: HeartbeatStatusResponse | undefined;
  jobResponse: Job | undefined;
  tfaStatus: TfaStatusResponse | undefined;
  lcdStatus: LcdStatusResponse | undefined;
  errorResponse: ErrorResponse | undefined;
  resinTankStatus: PnpTankResinStatus | undefined;
  PnpSafetyStatus: PnpSafetyStatusResponse | undefined;
}

export enum StreamActionResponse_Type {
  HEARTBEAT = "HEARTBEAT",
  NEW_JOB = "NEW_JOB",
  TFA_STATUS = "TFA_STATUS",
  LCD_STATUS = "LCD_STATUS",
  ERROR = "ERROR",
  RESIN_STATUS = "RESIN_STATUS",
  PNP_SAFETY_STATUS = "PNP_SAFETY_STATUS",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export interface PnpTankResinStatus {
  InTankResinLevel: number;
  OutTankResinLevel: number;
  lastUpdatedAt: Timestamp | undefined;
}

export interface TfaStatusResponse {
  /** if no ID, consider that no TFA installed */
  tfaId: string;
  dateChanged: Timestamp | undefined;
  printCount: number;
  layerCount: number;
  isChangeDetected: boolean;
}

export interface LcdStatusResponse {
  /** if no ID, consider that no LCD installed */
  lcdId: string;
  dateChanged: Timestamp | undefined;
  printCount: number;
  layerCount: number;
  isChangeDetected: boolean;
}

export interface PnpSafetyStatusResponse {
  DoorOpened: boolean;
  EStopTriggered: boolean;
  lastUpdatedAt: Timestamp | undefined;
}

export interface HeartbeatStatusResponse {
  updatedAt: Timestamp | undefined;
  isCoreConnected: boolean;
  isFirmwareConnected: boolean;
  isPnpConnected: boolean;
  printerName: string;
  isTucoConnected: boolean;
  isCloudConnected: boolean;
  printerStatus: HeartbeatStatusResponse_Status;
}

export enum HeartbeatStatusResponse_Status {
  ONLINE = "ONLINE",
  MAINTENANCE = "MAINTENANCE",
  ERROR = "ERROR",
  UNKNOWN = "UNKNOWN",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export interface Job {
  jobid: string;
  name: string;
  buildTime: number;
  totalLayers: number;
  createdAt: Timestamp | undefined;
  status: Job_Status;
  errorCode: number;
  errorMessage: string;
  volume: number;
  layerThickness: number;
  validatedFolder: string;
  /** this field is for UI to identify file. Aurora-core just return what receives. */
  uuid: string;
  jobsInCycle: number;
  cycleBuildTime: number;
  estimatedResinConsumption: number;
}

export enum Job_Status {
  UNKNOWN = "UNKNOWN",
  QUEUED = "QUEUED",
  ACTIVE = "ACTIVE",
  FAILED = "FAILED",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export interface ManyJobs {
  jobs: Job[];
}

export interface ErrorResponse {
  errorCode: string;
  errorMsg: string;
}

export interface File {
  name: string;
  path: string;
  resolutionUM: number;
  /** this field is for UI to identify file. Aurora-core just return what receives. */
  uuid: string;
}

export interface FileList {
  files: File[];
}

export interface Empty {
}

export interface DefaultPrintingProfile {
  profileName: string;
  layerErosion: boolean;
}

export interface PrintingPreferenceResponse {
  profileList: string[];
  defaultValues: DefaultPrintingProfile | undefined;
}

export interface PrintingProfileRequest {
  profileName: string;
}

export interface LayerErosionRequest {
  isEnabled: boolean;
  layersToErode: number;
  pixelsToErode: number;
}

export interface LayerErosionResponse {
  success: boolean;
  isEnabled: boolean;
  layersToErode: number;
  pixelsToErode: number;
}

export interface UVDuty {
  dutyCycle: number;
}

export const AURORACORE_PACKAGE_NAME = "auroracore";

export interface CoreServiceClient {
  streamActions(request: Empty): Observable<StreamActionResponse>;

  /** PnP access to UI - DASHBOARD */

  doInitialization(request: Empty): Observable<Response>;

  doInitializationAndScanning(request: Empty): Observable<DoInitializationAndScanningResponse>;

  resetPnP(request: Empty): Observable<Response>;

  cycleStop(request: Empty): Observable<Response>;

  doPickTask(request: Empty): Observable<Response>;

  doPlaceTask(request: Empty): Observable<Response>;

  /** JobQueue Page - Shared NY and SH */

  setFile(request: FileList): Observable<Job>;

  deleteFile(request: DeleteFileRequest): Observable<Response>;

  startPrint(request: Empty): Observable<StartPrintResponseStream>;

  cancelShPrint(request: CancelPrintRequest): Observable<Response>;

  /** printer maintenance and operation - shared NY and SH */

  setMaintenanceMode(request: MaintenanceModeRequest): Observable<Response>;

  doRaisePlatform(request: Empty): Observable<OperationPayload>;

  platformAlignment1(request: Empty): Observable<OperationPayload>;

  platformAlignment2(request: Empty): Observable<OperationPayload>;

  platformAlignment3(request: Empty): Observable<OperationPayload>;

  dmiRaisePlatform(request: Empty): Observable<OperationPayload>;

  dmiMain(request: Empty): Observable<OperationPayload>;

  ungripPlate(request: Empty): Observable<Response>;

  doMagnetOff(request: Empty): Observable<Response>;

  doMagnetOn(request: Empty): Observable<Response>;

  doDoorUnlock(request: Empty): Observable<Response>;

  /** print preference */

  getPrintingPreference(request: Empty): Observable<PrintingPreferenceResponse>;

  setPrintingProfile(request: PrintingProfileRequest): Observable<Response>;

  getTfaInfo(request: Empty): Observable<TfaStatusResponse>;

  getLcdInfo(request: Empty): Observable<LcdStatusResponse>;

  setLayerErosion(request: LayerErosionRequest): Observable<Response>;

  getLayerErosion(request: Empty): Observable<LayerErosionResponse>;

  /** NY  APIS */

  systemShutDown(request: Empty): Observable<Response>;

  setUvDutyCycle(request: UVDuty): Observable<Response>;

  getUvDutyCycle(request: Empty): Observable<Response>;

  buttonActionStream(request: Empty): Observable<ButtonActionStreamResponse>;

  cancelPrint(request: CancelPrintRequest): Observable<CancelPrintResponse>;

  nyTankCleaningRaisePlatform(request: Empty): Observable<OperationPayload>;

  nyTankCleaningMain(request: TankCleaningRequest): Observable<OperationPayload>;

  checkDoorStatus(request: Empty): Observable<DoorStatus>;

  layerInspectionComplete(request: layerInspectionCompleteRequest): Observable<Response>;
}

export interface CoreServiceController {
  streamActions(request: Empty): Observable<StreamActionResponse>;

  /** PnP access to UI - DASHBOARD */

  doInitialization(request: Empty): Observable<Response>;

  doInitializationAndScanning(request: Empty): Observable<DoInitializationAndScanningResponse>;

  resetPnP(request: Empty): Promise<Response> | Observable<Response> | Response;

  cycleStop(request: Empty): Promise<Response> | Observable<Response> | Response;

  doPickTask(request: Empty): Promise<Response> | Observable<Response> | Response;

  doPlaceTask(request: Empty): Promise<Response> | Observable<Response> | Response;

  /** JobQueue Page - Shared NY and SH */

  setFile(request: FileList): Observable<Job>;

  deleteFile(request: DeleteFileRequest): Promise<Response> | Observable<Response> | Response;

  startPrint(request: Empty): Observable<StartPrintResponseStream>;

  cancelShPrint(request: CancelPrintRequest): Promise<Response> | Observable<Response> | Response;

  /** printer maintenance and operation - shared NY and SH */

  setMaintenanceMode(request: MaintenanceModeRequest): Promise<Response> | Observable<Response> | Response;

  doRaisePlatform(request: Empty): Observable<OperationPayload>;

  platformAlignment1(request: Empty): Observable<OperationPayload>;

  platformAlignment2(request: Empty): Observable<OperationPayload>;

  platformAlignment3(request: Empty): Observable<OperationPayload>;

  dmiRaisePlatform(request: Empty): Observable<OperationPayload>;

  dmiMain(request: Empty): Observable<OperationPayload>;

  ungripPlate(request: Empty): Promise<Response> | Observable<Response> | Response;

  doMagnetOff(request: Empty): Promise<Response> | Observable<Response> | Response;

  doMagnetOn(request: Empty): Promise<Response> | Observable<Response> | Response;

  doDoorUnlock(request: Empty): Promise<Response> | Observable<Response> | Response;

  /** print preference */

  getPrintingPreference(
    request: Empty,
  ): Promise<PrintingPreferenceResponse> | Observable<PrintingPreferenceResponse> | PrintingPreferenceResponse;

  setPrintingProfile(request: PrintingProfileRequest): Promise<Response> | Observable<Response> | Response;

  getTfaInfo(request: Empty): Promise<TfaStatusResponse> | Observable<TfaStatusResponse> | TfaStatusResponse;

  getLcdInfo(request: Empty): Promise<LcdStatusResponse> | Observable<LcdStatusResponse> | LcdStatusResponse;

  setLayerErosion(request: LayerErosionRequest): Promise<Response> | Observable<Response> | Response;

  getLayerErosion(
    request: Empty,
  ): Promise<LayerErosionResponse> | Observable<LayerErosionResponse> | LayerErosionResponse;

  /** NY  APIS */

  systemShutDown(request: Empty): Promise<Response> | Observable<Response> | Response;

  setUvDutyCycle(request: UVDuty): Promise<Response> | Observable<Response> | Response;

  getUvDutyCycle(request: Empty): Promise<Response> | Observable<Response> | Response;

  buttonActionStream(request: Empty): Observable<ButtonActionStreamResponse>;

  cancelPrint(request: CancelPrintRequest): Observable<CancelPrintResponse>;

  nyTankCleaningRaisePlatform(request: Empty): Observable<OperationPayload>;

  nyTankCleaningMain(request: TankCleaningRequest): Observable<OperationPayload>;

  checkDoorStatus(request: Empty): Promise<DoorStatus> | Observable<DoorStatus> | DoorStatus;

  layerInspectionComplete(request: layerInspectionCompleteRequest): Promise<Response> | Observable<Response> | Response;
}

export function CoreServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "streamActions",
      "doInitialization",
      "doInitializationAndScanning",
      "resetPnP",
      "cycleStop",
      "doPickTask",
      "doPlaceTask",
      "setFile",
      "deleteFile",
      "startPrint",
      "cancelShPrint",
      "setMaintenanceMode",
      "doRaisePlatform",
      "platformAlignment1",
      "platformAlignment2",
      "platformAlignment3",
      "dmiRaisePlatform",
      "dmiMain",
      "ungripPlate",
      "doMagnetOff",
      "doMagnetOn",
      "doDoorUnlock",
      "getPrintingPreference",
      "setPrintingProfile",
      "getTfaInfo",
      "getLcdInfo",
      "setLayerErosion",
      "getLayerErosion",
      "systemShutDown",
      "setUvDutyCycle",
      "getUvDutyCycle",
      "buttonActionStream",
      "cancelPrint",
      "nyTankCleaningRaisePlatform",
      "nyTankCleaningMain",
      "checkDoorStatus",
      "layerInspectionComplete",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CoreService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CoreService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CORE_SERVICE_NAME = "CoreService";
