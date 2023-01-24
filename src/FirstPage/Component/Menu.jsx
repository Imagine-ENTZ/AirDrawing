import React from "react";
import "../Lobby.css";
import { useNavigate } from "react-router-dom";

function Menu() {
    const navigate = useNavigate();
    
    const navigateToMain = () => {
        navigate("/main");
    };

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
                    <div onClick={navigateToMain} className="selection button1">FOLLOW-UP</div>
                    <div className="selection button2">WORD-TRACING GAME</div>
                    <div onClick={() => navigate("/decorate")} className="selection button3">DECORATIVE GAME</div>
                    <div className="selection button4">FOLLOW-UP</div>
                </div>
            </div>
        </div>
    );
};

export default Menu;