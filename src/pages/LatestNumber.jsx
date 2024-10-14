import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {collection,query,orderBy,limit,getDocs,} from 'firebase/firestore';
import '../styles/LatestNumber.css';

function GetLatestNumber() {
  const [latestNumber, setLatestNumber] = useState('');

  useEffect(() => {
    const fetchLatestNumber = async () => {
      const q = query(
        collection(db, 'nfc'),
        orderBy('number', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const latestDoc = querySnapshot.docs[0];
        const latestNum = parseInt(latestDoc.data().number, 10) + 1;
        setLatestNumber(latestNum.toString().padStart(6, '0'));
      } else {
        setLatestNumber('000001');
      }
    };
    fetchLatestNumber();
  }, []);

  const copyClipboard = () => {
    if (latestNumber) {
      navigator.clipboard
        .writeText(latestNumber)
        .then(() => {
          alert('コピーしました');
        })
        .catch((err) => {
          console.error('コピーに失敗しました', err);
        });
    } else {
      alert('コピーする会員番号がありません');
    }
  };

  return (
    <div className="latest-container">
      <h2 className="latest-title">最新の会員番号: {latestNumber}</h2>
      <button onClick={copyClipboard} className="copy-button">コピー</button>
    </div>
  );
}

export default GetLatestNumber;
