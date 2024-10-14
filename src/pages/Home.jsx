import { Link } from 'react-router-dom';
import '../styles/Home.css';

export const Home = () => {
    return (
        <div className="home-container">
            <h1 className="app-title">会員番号管理アプリ</h1>
            <ul className="nav-list">
                <li className="nav-item"><Link to="/search" className="nav-link">会員番号検索</Link></li>
                <li className="nav-item"><Link to="/register" className="nav-link">NFC登録</Link></li>
                <li className="nav-item"><Link to="/latest" className="nav-link">最新の会員番号を取得</Link></li>
            </ul>
        </div>
    );
};

export default Home;
