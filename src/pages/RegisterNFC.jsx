import { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { NFC } from '../nfc';
import '../styles/RegisterNFC.css';

function RegisterNFC() {
  const [nfcId, setNfcId] = useState('');
  const [number, setNumber] = useState('');

  const nfc = new NFC();

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
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <button type="button" className="submit-button" onClick={connectUSBDevice}>FelicaReaderに接続</button>
        <div className="form-group">
          <label htmlFor="nfc-id">NFC ID:</label>
          <input
            id="nfc-id"
            type="text"
            value={nfcId}
            onChange={(e) => setNfcId(e.target.value)}
            className="input-field"
            required
            placeholder="NFC IDを入力"
          />
        </div>
        <div className="form-group">
          <label htmlFor="member-number">会員番号:</label>
          <input
            id="member-number"
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="input-field"
            required
            placeholder="会員番号を入力"
          />
        </div>
        <button type="submit" className="submit-button">登録</button>
      </form>
    </div>
  );
}

export default RegisterNFC;
