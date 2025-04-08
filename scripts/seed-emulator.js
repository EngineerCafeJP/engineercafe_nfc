import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, doc, getFirestore, setDoc } from 'firebase/firestore';

// Firebase設定
const firebaseConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'demo-nfc.firebaseapp.com',
  projectId: 'demo-nfc',
  storageBucket: 'demo-nfc.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef',
  measurementId: 'G-ABCDEF'
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// エミュレーターに接続
connectFirestoreEmulator(db, 'localhost', 8081);

// サンプルデータ
const sampleData = {
  members: [
    { id: '0123456789ABCDEF', memberNumber: 'M001', name: '山田太郎', department: '開発部' },
    { id: 'FEDCBA9876543210', memberNumber: 'M002', name: '鈴木花子', department: '営業部' },
    { id: 'A1B2C3D4E5F6G7H8', memberNumber: 'M003', name: '佐藤一郎', department: '人事部' }
  ],
  counters: [
    { id: 'counter1', value: 42, lastUpdated: new Date() }
  ],
  member_number: {
    id: 'member_number',
    latest_number: '001235'
  }
};

// データをエミュレーターに投入
async function seedEmulator() {
  console.log('エミュレーターにデータを投入中...');
  
  try {
    // メンバーデータの投入
    for (const member of sampleData.members) {
      await setDoc(doc(db, 'members', member.id), member);
      console.log(`メンバー ${member.name} (${member.id}) を追加しました`);
    }
    
    // カウンターデータの投入
    for (const counter of sampleData.counters) {
      await setDoc(doc(db, 'counters', counter.id), counter);
      console.log(`カウンター ${counter.id} を追加しました`);
    }

    // member_numberドキュメントの投入
    await setDoc(doc(db, 'counters', sampleData.member_number.id), {
      latest_number: sampleData.member_number.latest_number
    });
    console.log(`会員番号カウンターを追加しました`);
    
    console.log('データの投入が完了しました');
  } catch (error) {
    console.error('データの投入中にエラーが発生しました:', error);
  }
}

// スクリプト実行
seedEmulator(); 