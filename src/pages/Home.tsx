import { useContext, useEffect, useState } from "react";
import { NfcContext } from "../contexts/NfcContext";
import "../styles/Home.css";
import Latest from "./LatestNumber";
import Register from "./RegisterNFC";
import Search from "./SearchMember";

export const Home = () => {
  const { nfcId, setNfcId, nfc } = useContext(NfcContext)!;
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCardId = async () => {
    if (isPolling) return;
    
    setIsPolling(true);
    setError(null);
    
    try {
      while (isPolling) {
        const id = await nfc.readCard();
        if (id) {
          setNfcId(id);
          // カードを検出したら少し待機してから次のポーリングを開始
          await nfc.sleep(500);
        } else {
          // カードが検出されなかった場合は短い間隔で再試行
          await nfc.sleep(100);
        }
      }
    } catch (e) {
      console.error("カード検出中にエラーが発生:", e);
      setError(e instanceof Error ? e.message : String(e));
      setIsPolling(false);
    }
  };

  const connectUSBDevice = async () => {
    try {
      setError(null);
      await nfc.connectUSBDevice();
      setIsPolling(true);
      getCardId();
    } catch (e) {
      console.error("NFCリーダーの接続に失敗:", e);
      setError(e instanceof Error ? e.message : String(e));
      setIsPolling(false);
    }
  };

  // コンポーネントのアンマウント時にNFCリーダーを切断
  useEffect(() => {
    return () => {
      if (nfc) {
        nfc.disconnect().catch(console.error);
      }
    };
  }, [nfc]);

  return (
    <div className="home-container">
      <h1 className="app-title">会員番号管理アプリ</h1>
      <button
        type="button"
        className="felica-button"
        onClick={connectUSBDevice}
        disabled={isPolling}
      >
        {isPolling ? "FelicaReaderに接続中..." : "FelicaReaderに接続"}
      </button>
      {error && <div className="error-message">{error}</div>}
      <Search />
      <Register />
      <Latest />
    </div>
  );
};

export default Home; 