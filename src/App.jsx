
import Home from './pages/Home.jsx'
import Search from './pages/SearchMember.jsx'
import Register from './pages/RegisterNFC.jsx'
import Latest from './pages/LatestNumber.jsx'
import { BrowserRouter, Routes, Route} from 'react-router-dom'

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/register" element={<Register />} />
                <Route path="/latest" element={<Latest />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
