import Home from "./pages/Home.jsx";
import Search from "./pages/SearchMember.jsx";
import Register from "./pages/RegisterNFC.jsx";
import Latest from "./pages/LatestNumber.jsx";
import { NfcProvider } from "./contexts/NfcContext.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const App = () => {
  return (
    <NfcProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </NfcProvider>
  );
};

export default App;
