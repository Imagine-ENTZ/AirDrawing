import MainPage from "./MainPage/MainPage.jsx";
import HomePage from "./HomePage/HomePage.jsx";
import FirstPage from "./FirstPage/Home.jsx";
import LobbyPage from "./FirstPage/Lobby.jsx";
import LoginPage from "./HomePage/Login.jsx";
import SignupPage from "./HomePage/Signup.jsx";
import SelectionPage from "./FirstPage/Selection.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import TextConvertPage from "./textConvert.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<FirstPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/login-or-signup" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/capture" element = {<TextConvertPage/>}/>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/selection" element={<SelectionPage />} />
        {/* <Route path="/detail/:id" element={<Detail />} />
      <Route path="/mypage/*" element={<MyPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
