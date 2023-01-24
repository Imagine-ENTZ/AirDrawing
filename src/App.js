import MainPage from "./gamePage/MainPage.jsx";
import HomePage from "./homePage/HomePage.jsx";
import FirstPage from "./firstPage/Home.jsx";
import LobbyPage from "./firstPage/Lobby.jsx";
import LoginPage from "./homePage/Login.jsx";
import SignupPage from "./homePage/Signup.jsx";
import SelectionPage from "./firstPage/Selection.jsx";
import DecorativeGamePage from "./gamePage/DecorativeGameLobby.jsx";
import DecorationGamePage from "./gamePage/DecorativeGame.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<FirstPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/login-or-signup" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/main" element={<MainPage />} />
        <Route path="/selection" element={<SelectionPage />} />
        <Route path="/decorative" element={<DecorativeGamePage />} />
        <Route path="/decorative/game" element={<DecorationGamePage />} />

        {/* <Route path="/detail/:id" element={<Detail />} />
      <Route path="/mypage/*" element={<MyPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
