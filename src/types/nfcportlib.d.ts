declare class NFCPortLib {
  constructor();
  init(config: Configuration): Promise<void>;
  open(): Promise<void>;
  close(): Promise<void>;
  detectCard(cardType: string, option?: DetectionOption): Promise<CardInfo>;
  communicateThru(command: Uint8Array): Promise<Uint8Array>;
}

declare class Configuration {
  constructor(timeout?: number, retryCount?: number);
  timeout: number;
  retryCount: number;
}

declare class DetectionOption {
  constructor(
    idm?: Uint8Array,
    timeout?: number,
    autoPolling?: boolean,
    autoActivation?: boolean,
    autoActivationRetry?: number
  );
  idm: Uint8Array;
  timeout: number;
  autoPolling: boolean;
  autoActivation: boolean;
  autoActivationRetry: number;
}

interface CardInfo {
  idm: Uint8Array;
  uid: Uint8Array;
  type: string;
}

declare class NFCPortLibError extends Error {
  constructor(message: string, code: string);
  code: string;
} 