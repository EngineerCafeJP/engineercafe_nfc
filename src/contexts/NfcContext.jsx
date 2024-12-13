import { createContext, useState } from "react";
import { NFC } from "../nfc";

export const NfcContext = createContext();

export const NfcProvider = ({ children }) => {
  const [nfcId, setNfcId] = useState("");
  const [nfc, setNfc] = useState(new NFC());

  return (
    <NfcContext.Provider value={{ nfcId, setNfcId, nfc }}>
      {children}
    </NfcContext.Provider>
  );
};
