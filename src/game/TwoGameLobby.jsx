import React from "react";
import "./TwoGameLobby.css";
import Snow from "./component/Snow.jsx";
import TwoGameLobbyContainer from "./component/TwoGameLobbyContainer.jsx";

function TwoGameLobby() {

    return (
        <div className="hero">
            <Snow />
            <TwoGameLobbyContainer />
        </div>
    );
};

export default TwoGameLobby;