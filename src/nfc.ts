// Web USB APIの型定義
declare global {
  interface Navigator {
    usb: {
      requestDevice(options: { filters: Array<{ vendorId: number; productId: number }> }): Promise<USBDevice>;
    };
  }

  interface USBDevice {
    open(): Promise<void>;
    close(): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
    transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
  }

  interface USBOutTransferResult {
    status: 'ok' | 'stall' | 'babble';
    bytesWritten: number;
  }

  interface USBInTransferResult {
    status: 'ok' | 'stall' | 'babble';
    data: DataView;
  }
}

// NFCPortLibを使用するNFCクラス
export class NFC {
  private lib: any = null;
  private config: any = null;
  private cL: (...args: any[]) => void;

  constructor(debug: boolean = false) {
    this.cL = debug ? console.log : () => {};
  }

  async sleep(msec: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, msec));
  }

  async connectUSBDevice(): Promise<void> {
    try {
      this.cL("NFCPortLibを初期化中...");
      this.lib = new (window as any).NFCPortLib();
      this.config = new (window as any).Configuration(500, 500); // タイムアウト500ms
      await this.lib.init(this.config);
      this.cL("NFCPortLibを初期化しました");
      
      this.cL("NFCリーダーに接続中...");
      await this.lib.open();
      this.cL("NFCリーダーに接続しました");
    } catch (e) {
      this.cL("NFCリーダーの接続に失敗:", e);
      throw e;
    }
  }

  async disconnect(): Promise<void> {
    if (this.lib) {
      try {
        await this.lib.close();
        this.lib = null;
        this.config = null;
        this.cL("NFCリーダーとの接続を切断しました");
      } catch (e) {
        this.cL("切断中にエラーが発生:", e);
        throw e;
      }
    }
  }

  async readCard(): Promise<string | undefined> {
    if (!this.lib) {
      throw new Error("NFCリーダーが接続されていません");
    }

    try {
      // FeliCaカードの検出を試みる
      const felicaOption = new (window as any).DetectionOption(
        new Uint8Array([0xff, 0xff]), // すべてのIDm
        0, // タイムアウトなし
        true, // 自動ポーリング
        false, // 自動アクティベーションなし
        undefined // システムコードなし
      );

      try {
        this.cL("FeliCaカードを検出中...");
        const felicaCard = await this.lib.detectCard('iso18092', felicaOption);
        if (felicaCard && felicaCard.idm) {
          const idmHex = Array.from(felicaCard.idm as Uint8Array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
          this.cL(`FeliCaカードを検出: ${idmHex}`);
          return idmHex;
        }
      } catch (felicaError) {
        this.cL("FeliCaカードの検出に失敗:", felicaError);
      }

      // Type A (Mifare)カードの検出を試みる
      try {
        this.cL("Type Aカードを検出中...");
        const typeACard = await this.lib.detectCard('iso14443-3A');
        if (typeACard && typeACard.uid) {
          const uidHex = Array.from(typeACard.uid as Uint8Array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
          this.cL(`Type Aカードを検出: ${uidHex}`);
          return uidHex;
        }
      } catch (typeAError) {
        this.cL("Type Aカードの検出に失敗:", typeAError);
      }

      return undefined;
    } catch (e) {
      this.cL("カード検出中にエラーが発生:", e);
      throw e;
    }
  }
}




