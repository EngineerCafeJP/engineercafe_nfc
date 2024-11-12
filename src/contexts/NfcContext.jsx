import { createContext, useState } from 'react';

export const NfcContext = createContext();

export const NfcProvider = ({ children }) => {
    const [nfcId, setNfcId] = useState('');

    return (
        <NfcContext.Provider value={{ nfcId, setNfcId }}>
            {children}
        </NfcContext.Provider>
    );
};