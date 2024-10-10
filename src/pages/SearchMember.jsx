import  { useState } from 'react';
import { db } from '../firebase';
import { collection, where, query, getDocs } from 'firebase/firestore';

function SearchMember() {
  const [nfcId, setNfcId] = useState('');
  const [number, setNumber] = useState('');

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

  return (
    <div>
      <div>
        <label>NFC IDで検索:</label>
        <input value={nfcId} onChange={(e) => setNfcId(e.target.value)} />
        <button onClick={handleSearch}>検索</button>
      </div>
      {number && (
        <div>
          <h3>会員番号: {number}</h3>
          <button onClick={copyClipboard}>コピー</button>
        </div>
      )}
    </div>
  );
}

export default SearchMember;
