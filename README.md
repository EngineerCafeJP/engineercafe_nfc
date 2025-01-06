# NFC

## 環境構築

Cardreaderの種類
RC-S300

### プロジェクトの立ち上げ方

```bash
npm install
```

```bash
npm run dev
```

### Firebaseのエミュレーターの立ち上げ方

プロジェクトのexample.envを.envにリネームして、firebaseのプロジェクトの設定を書き換える。

```bash
VITE_FIREBASE_PROJECT_ID=
VITE_FIRESTORE_EMULATOR_HOST=
VITE_FIRESTORE_EMULATOR_PORT=
```

#### ローカルでの設定

project-idは自分が設定したdemo-nfcのプロジェクトIDを入れる。（ここはdemo-〇〇の形式である必要がある）
EMULATOR_HOST=localhost、PORT=8080を設定する必要がある。

はじめにエミュレーターを立ち上げる

```bash
firebase emulators:start  --project demo-nfc
```

一度サンプルにあるFfirestore.jsonをエミュレーターにデータを書き込む
もう一度立ち上げる時のためにデータをエキスポートしておく。
（エミュレーターのプロジェクトにdataフォルダを作成してそこにエクスポートする

```bash

firebase emulators:export ./data --project demo-nfc
```

2回目以降は以下のコマンドでエミュレーターを立ち上げる。

```bash
firebase emulators:start --import=./data --project demo-nfc
```

### デプロイ

```bash
firebase deploy --only functions
```
