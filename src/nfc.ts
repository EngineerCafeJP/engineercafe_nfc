  // Start of Selection
class NFC {
  private device: any = null;
  private deviceEp: { in: number; out: number } = { in: 0, out: 0 };
  private seqNumber: number = 0;
  private cL: (...args: any[]) => void;

  constructor(debug: boolean = false) {
    this.cL = () => {};
    if (debug === true) {
      this.cL = console.log; // for Debug code
    }
  }

  async sleep(msec: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, msec));
  }

  async send(data: number[]): Promise<void> {
    let argData = new Uint8Array(data);
    const dataLen = argData.length;
    const SLOTNUMBER = 0x00;
    let retVal = new Uint8Array(10 + dataLen);

    retVal[0] = 0x6b; // ヘッダー作成
    retVal[1] = 255 & dataLen; // length をリトルエンディアン
    retVal[2] = (dataLen >> 8) & 255;
    retVal[3] = (dataLen >> 16) & 255;
    retVal[4] = (dataLen >> 24) & 255;
    retVal[5] = SLOTNUMBER; // タイムスロット番号
    retVal[6] = ++this.seqNumber; // 認識番号

    0 != dataLen && retVal.set(argData, 10); // コマンド追加
    this.cL(">>>>>>>>>>");
    this.cL(Array.from(retVal).map((v) => v.toString(16)));
    const out = await this.device!.transferOut(this.deviceEp.out, retVal);
    await this.sleep(50);
  }

  async receive(len: number): Promise<number[]> {
    this.cL("<<<<<<<<<<" + len);
    let data = await this.device!.transferIn(this.deviceEp.in, len);
    await this.sleep(10);
    let arr: number[] = [];
    let arr_str: string[] = [];
    for (let i = data.data.byteOffset; i < data.data.byteLength; i++) {
      arr.push(data.data.getUint8(i));
      arr_str.push(this.dec2HexString(data.data.getUint8(i)));
    }
    this.cL(arr_str);
    return arr;
  }

  async session(): Promise<string | undefined> {
    const len = 50;
    await this.send([0xff, 0x56, 0x00, 0x00]);
    await this.receive(len);
    await this.send([0xff, 0x50, 0x00, 0x00, 0x02, 0x82, 0x00, 0x00]);
    await this.receive(len);
    await this.send([0xff, 0x50, 0x00, 0x00, 0x02, 0x81, 0x00, 0x00]);
    await this.receive(len);
    await this.send([0xff, 0x50, 0x00, 0x00, 0x02, 0x83, 0x00, 0x00]);
    await this.receive(len);
    await this.send([0xff, 0x50, 0x00, 0x00, 0x02, 0x84, 0x00, 0x00]);
    await this.receive(len);

    await this.send([
      0xff, 0x50, 0x00, 0x02, 0x04, 0x8f, 0x02, 0x03, 0x00, 0x00,
    ]);
    await this.receive(len);

    await this.send([
      0xff, 0x50, 0x00, 0x01, 0x00, 0x00, 0x11, 0x5f, 0x46, 0x04, 0xa0, 0x86,
      0x01, 0x00, 0x95, 0x82, 0x00, 0x06, 0x06, 0x00, 0xff, 0xff, 0x01, 0x00,
      0x00, 0x00, 0x00,
    ]);
    const poling_res_f = await this.receive(len);
    if (poling_res_f.length == 46) {
      const idm = poling_res_f.slice(26, 34).map((v) => this.dec2HexString(v));
      const idmStr = idm.join("");
      return idmStr;
    }
    await this.send([
      0xff, 0x50, 0x00, 0x02, 0x04, 0x8f, 0x02, 0x00, 0x03, 0x00,
    ]);
    await this.receive(len);
    await this.send([0xff, 0xca, 0x00, 0x00]);

    const poling_res_a = await this.receive(len);

    if (poling_res_a.length == 19) {
      const id = poling_res_a.slice(10, 17).map((v) => this.dec2HexString(v));
      const idStr = id.join("");
      return idStr;
    }
  }

  async connectUSBDevice(): Promise<void> {
    const deviceFilters = [
      {
        vendorId: 0x054c,
        productId: 0x0dc8,
      },
      {
        vendorId: 0x054c,
        productId: 0x0dc9,
      },
    ];
    try {
      this.cL(navigator);
      let pairedDevices = await (navigator as any).usb.getDevices();
      pairedDevices = pairedDevices.filter((d: any) =>
        deviceFilters.map((p) => p.productId).includes(d.productId),
      );
      this.device =
        pairedDevices.length == 1
          ? pairedDevices[0]
          : await (navigator as any).usb.requestDevice({ filters: deviceFilters });
      this.cL("open");
      await this.device.open();
      this.cL(this.device);
      this.cL("selectConfiguration");
      await this.device.selectConfiguration(1);
      this.cL("this.cLaimInterface");
      this.cL(this.device);
      const deviceInterface = this.device.configuration.interfaces.filter(
        (v: { alternate: { interfaceClass: number; }; }) => v.alternate.interfaceClass == 255,
      )[0];
      await this.device.claimInterface(deviceInterface.interfaceNumber);
      this.deviceEp = {
        in: deviceInterface.alternate.endpoints.filter(
          (e: { direction: string; }) => e.direction == "in",
        )[0].endpointNumber,
        out: deviceInterface.alternate.endpoints.filter(
          (e: { direction: string; }) => e.direction == "out",
        )[0].endpointNumber,
      };
    } catch (e) {
      this.cL(e);
      alert(e);
      throw e;
    }
  }

  close(): void {
    this.device?.close();
  }

  padding_zero(num: string, p: number): string {
    return ("0".repeat(p * 1) + num).slice(-(p * 1));
  }

  dec2HexString(n: number): string {
    return this.padding_zero((n * 1).toString(16).toUpperCase(), 2);
  }
}

export { NFC };
