import { FC } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NfcProvider } from "./contexts/NfcContext";
import Home from "./pages/Home";
import Latest from "./pages/LatestNumber";
import Register from "./pages/RegisterNFC";
import Search from "./pages/SearchMember";

export const App: FC = () => {
  return (
    <NfcProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/register" element={<Register />} />
          <Route path="/latest" element={<Latest />} />
        </Routes>
      </BrowserRouter>
    </NfcProvider>
  );
};

export default App; 