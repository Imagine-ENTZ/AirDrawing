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
            <div className="top-container-menu">
                <div className="direction-frame-menu" onClick={() => navigate("/")}>
                    <img className="direction-image-menu" src={Direction} alt="direct" />
                </div>
            </div>

            <div className="body-container-menu">
                <div className="left-container-menu">
                    <div className="next-menu-sentence">
                        <div className="safety"><span>Welcome, </span><span className="user-name">ENSHARP</span></div>
                        <div className="sentence">{sentence[0]}</div>
                    </div>
                </div>
                <div className="right-container-menu">
                    <div className="button-list">
                        <div className="selection button2" onClick={() => navigate("/word-tracing")}>WORD-TRACING GAME</div>
                        <div className="selection button3" onClick={() => navigate("/decorative")}>DECORATIVE GAME</div>
                        <div className="selection button4" onClick={() => navigate("/2p-lobby")}>2P GAME</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;