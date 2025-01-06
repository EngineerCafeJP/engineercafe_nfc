import { useContext } from "react";
import { NfcContext } from "../contexts/NfcContext";
import "../styles/Home.css";
import Register from "./RegisterNFC";
import Search from "./SearchMember";

export const Home = () => {
  const { nfcId, setNfcId, nfc } = useContext(NfcContext)!;

  const getCardId = async () => {
    try {
      do {
        await nfc.connectUSBDevice();
        const id = await nfc.session();
        if (id) {
          setNfcId(id);
        }
        await nfc.sleep(100);
      } while (true);
    } catch (e) {
      console.log(e);
      alert(e);
      try {
        nfc.close();
      } catch (e) {
        console.log(e);
      }
      throw e;
    }
  };

  const connectUSBDevice = async () => {
    await nfc.connectUSBDevice();
    getCardId();
  };

  return (
    <div className="home-container">
      <h1 className="app-title">会員番号管理アプリ</h1>
      <button
        type="button"
        className="felica-button"
        onClick={connectUSBDevice}
      >
        FelicaReaderに接続
      </button>
      <Search />
      <Register />
      {/* <Latest /> */}
    </div>
  );
};

export default Home; 