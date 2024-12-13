import { useState, useContext } from "react";
import { db } from "../firebase";
import { collection, where, query, getDocs } from "firebase/firestore";
import { NfcContext } from "../contexts/NfcContext.jsx";
import "../styles/SearchMember.css";

function SearchMember() {
  const [number, setNumber] = useState("");

  const { nfcId, setNfcId, nfc } = useContext(NfcContext);

  const handleSearch = async () => {
    const q = query(collection(db, "nfc"), where("nfc_id", "==", nfcId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      setNumber(doc.data().number);
      copyClipboard();
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

  const copyClipboard = () => {
    document.body.focus();
    navigator.clipboard.writeText(number);
    alert("クリップボードにコピーしました");
  };

  return (
    <div className="search-container">
      <h1>会員番号検索</h1>
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
          <button onClick={copyClipboard} className="copy-button">
            コピー
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchMember;
