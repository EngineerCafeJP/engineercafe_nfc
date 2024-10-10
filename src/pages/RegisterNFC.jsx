import { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';


function RegisterNFC() {
  const [nfcId, setNfcId] = useState('');
  const [number, setNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, 'nfc', number);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        alert('この会員番号は既に登録されています');
      } else {
        await setDoc(docRef, {
          nfc_id: nfcId,
          number: number,
        });
        alert('NFC情報を登録しました');
        setNfcId('');
        setNumber('');
      }
    } catch (error) {
      console.error('エラーが発生しました: ', error);
      alert('登録中にエラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div>
        <label>NFC ID:</label>
        <input
          value={nfcId}
          onChange={(e) => setNfcId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>会員番号:</label>
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
      </div>
      <button type="submit">登録</button>
    </form>
    </>
  );
}

export default RegisterNFC;
