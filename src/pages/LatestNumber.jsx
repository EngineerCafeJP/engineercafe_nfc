import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  getDocs,
  doc,
  documentId,
  where,
  runTransaction,
} from "firebase/firestore";
import "../styles/LatestNumber.css";

function GetLatestNumber() {
  const [nextNumber, setNextNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getNextNumber = (currentNumber) => {
    const numericPart = parseInt(currentNumber, 10);
    return (numericPart + 1).toString().padStart(6, "0");
  };

  const fetchNextNumber = async () => {
    try {
      const q = query(
        collection(db, "conters"),
        where(documentId(), "==", "member_number"),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const latestDoc = querySnapshot.docs[0];
        const latestNum = latestDoc.data().latest_number;
        const next = getNextNumber(latestNum);
        setNextNumber(next);
      } else {
        console.error("番号の取得に失敗しました");
        setNextNumber("000001");
      }
    } catch (error) {
      console.error("番号の取得中にエラーが発生しました:", error);
      alert("番号の取得に失敗しました");
    }
  };

  useEffect(() => {
    fetchNextNumber();
  }, []);

  const copyNumber = () => {
    if (nextNumber) {
      navigator.clipboard
        .writeText(nextNumber)
        .then(() => {
          alert("コピーしました");
        })
        .catch((err) => {
          console.error("コピーに失敗しました", err);
          alert("コピーに失敗しました");
        });
    }
  };

  const handleIncrementClick = () => {
    if (
      window.confirm(
        `会員番号「${nextNumber}」をインクリメントしますか？\nインクリメント後、この番号は使用できなくなります。`,
      )
    ) {
      incrementNumber();
    }
  };

  const incrementNumber = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const counterRef = doc(db, "conters", "member_number");

      await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);

        if (!counterDoc.exists()) {
          throw new Error("Counter document does not exist!");
        }

        const currentNumber = counterDoc.data().latest_number;
        const newNumber = getNextNumber(currentNumber);

        transaction.update(counterRef, {
          latest_number: newNumber,
          updatedAt: new Date(),
        });

        return newNumber;
      });

      await fetchNextNumber();
      alert("会員番号をインクリメントしました");
    } catch (error) {
      console.error("インクリメント中にエラーが発生しました:", error);
      alert("インクリメントに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="latest-container">
      <div className="number-display">
        <div className="number-item">
          <h2 className="number-title">割り当てる会員番号:</h2>
          <div className="number-value-container">
            <span className="number-value">{nextNumber}</span>
            <button
              onClick={copyNumber}
              className="copy-button"
              disabled={!nextNumber || isLoading}
            >
              コピー
            </button>
          </div>
        </div>
      </div>
      <div className="action-container">
        <button
          onClick={handleIncrementClick}
          className="increment-button"
          disabled={isLoading}
        >
          {isLoading ? "処理中..." : "会員番号をインクリメントする"}
        </button>
      </div>
    </div>
  );
}

export default GetLatestNumber;
