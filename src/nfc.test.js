import { expect, test, describe } from "vitest";
import * as NFC from "./nfc";

describe("NFC", () => {
  test("Zero Padding", () => {
    const nfc = new NFC.NFC(true);
    expect(nfc.padding_zero(10, 4)).toBe("0010");
  });
  test("Dec2HexString", () => {
    const nfc = new NFC.NFC(true);
    expect(nfc.dec2HexString(10)).toBe("0A");
    expect(nfc.dec2HexString(12)).toBe("0C");
    expect(nfc.dec2HexString(0)).toBe("00");
    expect(nfc.dec2HexString(30)).toBe("1E");
  });
});
