import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, documentId, where, runTransaction } from 'firebase/firestore';
import '../styles/LatestNumber.css';

function GetLatestNumber() {
  const [latestNumber, setLatestNumber] = useState('');

  const fetchLatestNumber = async () => {
    const q = query(collection(db, 'counters'), where(documentId(), '==', 'member_number'));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const latestDoc = querySnapshot.docs[0];
      const latestNum = parseInt(latestDoc.data().latest_number, 10);
      setLatestNumber(latestNum.toString().padStart(6, '0'));
    } else {
      setLatestNumber('000000');
      console.error("番号の取得に失敗しました");
    }
  };

  useEffect(() => {
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

  const incrementMemberNumber = (latestNumber) => {
    // 最新の会員番号（文字列）の数値部分をインクリメント
    let numericPart = parseInt(latestNumber, 10);
    numericPart += 1;

    // インクリメント後、ゼロ埋めして6桁の文字列に変換
    return numericPart.toString().padStart(6, '0');
  }

  const incrementLatestNumber = async () => {
    const q = query(collection(db, 'counters'), where(documentId(), '==', 'member_number'));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const latestDoc = querySnapshot.docs[0];
      try {
        const latestNumber = latestDoc.data().latest_number;
        const newMemberNumber = incrementMemberNumber(latestNumber);
        await runTransaction(db, async (transaction) => {
          transaction.update(latestDoc.ref, { latest_number: newMemberNumber });
        });
        // 会員番号をインクリメント
      } catch (error) {
        console.error("番号のインクリメントに失敗しました:", error);
      }
      fetchLatestNumber();
      alert('インクリメントしました');
    } else {
      console.error("番号の取得に失敗しました");
    }
  }

  return (
    <div className="latest-container">
      <h2 className="latest-title">最新の会員番号: {latestNumber}</h2>
      <ul className="nav-list">
        <li className="nav-item"><button onClick={copyClipboard} className="copy-button">コピー</button>
        </li>
        <li className="nav-item"><button onClick={incrementLatestNumber} className="copy-button">会員番号インクリメント</button>
        </li>
      </ul>
    </div>
  );
}

export default GetLatestNumber;
