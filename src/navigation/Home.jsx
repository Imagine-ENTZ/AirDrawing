import React from "react";
import "./Home.css";
import "./Lobby.css";
import Main from "./component/Main.jsx";
import Snow from "./component/Snow.jsx";

function Home() {

    return (
        <div className="hero">
            <Snow/>
            <Main/>
        </div>
    );
};

export default Home;