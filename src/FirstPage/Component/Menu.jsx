import React from "react";
import "../Lobby.css";
import { useNavigate } from "react-router-dom";

function Menu() {
    const navigate = useNavigate();

    const sentence = {
        0: 'Choose\nGame\nAnd\nJoin it!'
    }

    return (
        <div className="main-container-menu">
            <div className="left-container-menu">
                <div className="safety"><span>Welcome, </span><span className="user-name">ENSHARP</span></div>
                <div className="sentence">{sentence[0]}</div>
            </div>
            <div className="right-container-menu">
                <div className="button-list">
                    <button onClick={() => navigate("/main")} className="selection button1">FOLLOW-UP</button>
                    <button onClick={() => navigate("/word-tracing")} className="selection button2">FOLLOW-UP</button>
                    <button className="selection button3">FOLLOW-UP</button>
                    <button className="selection button4">FOLLOW-UP</button>
                </div>
            </div>
        </div>
    );
};

export default Menu;