import React from "react";
import "./Home.css";
import "./Lobby.css";
import Main from "./Component/Main.jsx";
import Snow from "./Component/Snow.jsx";

function Home() {

    return (
        <div className="hero">
            <Snow/>
            <Main/>
        </div>
    );
};

export default Home;