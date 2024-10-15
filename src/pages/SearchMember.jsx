import  { useState } from 'react';
import { db } from '../firebase';
import { NFC } from '../nfc';
import { collection, where, query, getDocs } from 'firebase/firestore';
import '../styles/SearchMember.css';

function SearchMember() {
  const [nfcId, setNfcId] = useState('');
  const [number, setNumber] = useState('');

  const nfc = new NFC();

  const handleSearch = async () => {
    const q = query(collection(db, 'nfc'), where('nfc_id', '==', nfcId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      setNumber(doc.data().number);
    } else {
      alert('会員が見つかりません');
    }
  };

  const copyClipboard = () => {
    navigator.clipboard.writeText(number);
    alert('クリップボードにコピーしました');
  };

  const getCardId = async () => {
    try {
      do {
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
  }

  const connectUSBDevice = async () => {
    await nfc.connectUSBDevice();
    getCardId();
  }

  return (
    <div className="search-container">
      <button type="button" className="felica-button" onClick={connectUSBDevice}>FelicaReaderに接続</button>
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
        <button onClick={handleSearch} className="search-button">検索</button>
      </div>
      {number && (
        <div className="result-container">
          <h3 className="result-text">会員番号: {number}</h3>
          <button onClick={copyClipboard} className="copy-button">コピー</button>
        </div>
      )}
    </div>
  );
}

export default SearchMember;
