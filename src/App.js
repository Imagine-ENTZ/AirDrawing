import MainPage from "./MainPage/MainPage.jsx";
import HomePage from "./HomePage/HomePage.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route path="/main" element={<MainPage />} />
      {/* <Route path="/detail/:id" element={<Detail />} />
      <Route path="/mypage/*" element={<MyPage />} /> */}
    </Routes>
  );
}

export default App;
