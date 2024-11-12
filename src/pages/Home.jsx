import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { NFC } from '../nfc';
import '../styles/Home.css';
import { NfcContext } from '../contexts/NfcContext.jsx';

export const Home = () => {

    const { nfcId, setNfcId } = useContext(NfcContext);
    
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

    let nfc = new NFC();

    return (
        <div className="home-container">
            <h1 className="app-title">会員番号管理アプリ</h1>
            <ul className="nav-list">
                <li className="nav-item"><Link to="/search" className="nav-link">会員番号検索</Link></li>
                <li className="nav-item"><Link to="/register" className="nav-link">NFC登録</Link></li>
                <li className="nav-item"><Link to="/latest" className="nav-link">最新の会員番号を取得</Link></li>
            </ul>
            <button type="button" className="felica-button" onClick={connectUSBDevice}>FelicaReaderに接続</button>
        </div>
    );
};

export default Home;
