import MainPage from "./MainPage/MainPage.jsx";
import HomePage from "./HomePage/HomePage.jsx";
import FirstPage from "./FirstPage/Home.jsx";
import LobbyPage from "./FirstPage/Lobby.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import TextConvertPage from "./textConvert.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<FirstPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/login" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/capture" element = {<TextConvertPage/>}/>
        {/* <Route path="/detail/:id" element={<Detail />} />
      <Route path="/mypage/*" element={<MyPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
