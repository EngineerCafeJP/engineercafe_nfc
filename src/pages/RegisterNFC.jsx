import { useState, useContext } from 'react';
import { db } from '../firebase';
import { doc, setDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { NfcContext } from '../contexts/NfcContext.jsx';
import '../styles/RegisterNFC.css';

function RegisterNFC() {
  const [number, setNumber] = useState('');
  const { nfcId, setNfcId } = useContext(NfcContext);

  // 新規データ登録関数
  const handleRegisterClick = async (e) => {
    e.preventDefault();

    if (!number.trim() || !nfcId.trim()) {
      alert('NFC ID または会員番号が無効です');
      return;
    }

    // 確認ダイアログを表示
    const isConfirmed = window.confirm(
      `以下の内容で新規登録を行います：\n\nNFC ID: ${nfcId}\n会員番号: ${number}\n\nよろしいですか？`
    );

    if (!isConfirmed) return;

    try {
      const docRef = doc(db, 'nfc', nfcId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        alert('このカードは既に登録されています');
      } else {
        // 新規登録
        const docRef = doc(db, 'nfc', number);
        await setDoc(docRef, { nfc_id: nfcId, number });
        alert('新しいNFC情報を登録しました');
        setNfcId('');
        setNumber('');
      }
    } catch (error) {
      console.error('エラーが発生しました: ', error);
      alert(`登録中にエラーが発生しました: ${error.message}`);
    }
  };

  const handleUpdateClick = async (e) => {
    e.preventDefault();

    if (!number.trim() || !nfcId.trim()) {
      alert('NFC ID または会員番号が無効です');
      return;
    }

    // 確認ダイアログを表示
    const isConfirmed = window.confirm(
      `以下の内容で既存のデータを上書きします：\n\nNFC ID: ${nfcId}\n会員番号: ${number}\n\nこの操作は取り消せません。よろしいですか？`
    );

    if (!isConfirmed) return;

    try {
      // nfc_id でデータを検索
      const q = query(collection(db, 'nfc'), where('nfc_id', '==', nfcId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // nfc_id が一致する場合、データを上書き
        const docRef = doc(db, 'nfc', querySnapshot.docs[0].id);
        await setDoc(docRef, { nfc_id: nfcId, number }, { merge: true });
        alert('既存のデータを上書きしました');
      } else {
        alert('指定されたNFC IDは存在しません');
      }

      // 入力状態をリセット
      setNfcId('');
      setNumber('');
    } catch (error) {
      console.error('エラーが発生しました: ', error);
      alert(`上書き中にエラーが発生しました: ${error.message}`);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form">
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
        <button type="submit" onClick={handleRegisterClick} className="submit-button">新規登録</button>
        <button type="button" onClick={handleUpdateClick} className="submit-button">上書き更新</button>
      </form>
    </div>
  );
}

export default RegisterNFC;
