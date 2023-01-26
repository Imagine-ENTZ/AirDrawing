import React from "react";
import "../Lobby.css";
import { useNavigate } from "react-router-dom";
import Direction from "../img/direction-arrow.png";

function Menu() {
    const navigate = useNavigate();

    const sentence = {
        0: 'Choose\nGame\nAnd\nJoin it!'
    }

    return (
        <div className="main-container-menu">
            <div className="left-container-menu">
                <div className="left-top-container-menu">
                    <div className="direction-frame-menu" onClick={() => navigate("/")}>
                        <img className="direction-image-menu" src={Direction} alt="direct" />
                    </div>
                </div>
                <div className="left-body-container-menu">
                    <div className="next-menu-sentence">
                    <div className="safety"><span>Welcome, </span><span className="user-name">ENSHARP</span></div>
                    <div className="sentence">{sentence[0]}</div>
                    </div>
                </div>
            </div>
            <div className="right-container-menu">
                <div className="button-list">
                    <div onClick={() => navigate("/main")} className="selection button1">FOLLOW-UP</div>
                    <div className="selection button2" onClick={() => navigate("/word-tracing")}>WORD-TRACING GAME</div>
                    <div onClick={() => navigate("/decorative")} className="selection button3">DECORATIVE GAME</div>
                    <div onClick={() => navigate("/2p-lobby")} className="selection button4">2P - DECORATIVE GAME</div>
                </div>
            </div>
        </div>
    );
};

export default Menu;