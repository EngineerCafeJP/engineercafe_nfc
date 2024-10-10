import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div>
            <h1>会員番号管理アプリ</h1>
            <ul>
                <li><Link to="/search">会員番号検索</Link></li>
                <li><Link to="/register">NFC登録</Link></li>
                <li><Link to="/latest">最新の会員番号を取得</Link></li>
            </ul>
        </div>
    );
}

export default Home;
