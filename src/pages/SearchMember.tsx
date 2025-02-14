import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useState } from "react";
import { NfcContext } from "../contexts/NfcContext";
import { db } from "../firebase";
import "../styles/SearchMember.css";

function SearchMember() {
  const [number, setNumber] = useState("");

  const { nfcId, setNfcId, nfc } = useContext(NfcContext)!;

  const handleSearch = async () => {
    const q = query(collection(db, "nfc"), where("nfc_id", "==", nfcId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      setNumber(doc.data().number);
      await copyClipboard(doc.data().number);
    } else {
      alert("会員が見つかりません");
      await nfc.connectUSBDevice();
      await nfc.session();
    }
    await nfc.connectUSBDevice();
    await nfc.session();
  };

  const handleFormClear = () => {
    setNfcId("");
  };

  const copyClipboard = async (numberToCopy: string) => {
    try {
      await navigator.clipboard.writeText(String(numberToCopy));
      alert("クリップボードにコピーしました: " + numberToCopy);
    } catch (err) {
      console.error("クリップボードへのコピーに失敗しました", err);
      alert("クリップボードにコピーできませんでした");
    }
  };

  return (
    <div className="search-container">
      <h2>会員番号検索</h2>
      <div className="search-input-container">
        <label htmlFor="nfc-search">NFC IDで検索:</label>
        <input
          id="nfc-search"
          type="text"
          value={nfcId}
          onChange={(e) => setNfcId(e.target.value)}
          className="input-field"
          placeholder="NFC IDを入力"
        />
        <div className="button-container">
          <button onClick={handleSearch} className="search-button">
            検索
          </button>
          <button onClick={handleFormClear} className="search-button">
            クリア
          </button>
        </div>
      </div>
      {number && (
        <div className="result-container">
          <h3 className="result-text">会員番号: {number}</h3>
          <button onClick={() => copyClipboard(number)} className="copy-button">
            コピー
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchMember; 