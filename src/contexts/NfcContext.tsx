import { createContext, FC, ReactNode, useState } from "react";
import { NFC } from "../nfc";

interface NfcContextType {
  nfcId: string;
  setNfcId: React.Dispatch<React.SetStateAction<string>>;
  nfc: NFC;
}

export const NfcContext = createContext<NfcContextType | undefined>(undefined);

interface NfcProviderProps {
  children: ReactNode;
}

export const NfcProvider: FC<NfcProviderProps> = ({ children }) => {
  const [nfcId, setNfcId] = useState("");
  const [nfc, setNfc] = useState(new NFC());

  return (
    <NfcContext.Provider value={{ nfcId, setNfcId, nfc }}>
      {children}
    </NfcContext.Provider>
  );
}; 