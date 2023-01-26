import React from "react";
import "./DecorativeGameLobby.css";
import StarRain from "./component/StarRain.jsx";
import Direction from "./img/direction-arrow.png";
import { useNavigate } from "react-router-dom";

function DecorativeGameLobby() {
    const navigate = useNavigate();

    const decoration_sentence = {
        0: 'Decorate\nCanvas\nAnd\nTake a picture'
    }

    return (
        <div className="main-container-decoration">
            <StarRain />
            <div className="top-container-decoration">
                <div className="direction-frame-decoration" onClick={() => navigate("/lobby")}>
                    <img className="direction-image-decoration" src={Direction} alt="direct" />
                </div>
            </div>
            <div className="body-container-decoration">
                <div className="left-container-decoration">
                    <div className="left-top-container-decoration">
                        <div className="decoration-sentence">{decoration_sentence[0]}</div>
                    </div>
                    <div className="left-bottom-container-decoration">
                        <div className="decoration-button-list">
                            <div className="start-or-how-decoration button1_deco" onClick={() => navigate("/decorative/game")}>START</div>
                            <div className="start-or-how-decoration button2_deco" onClick={() => navigate("/decorative/howto")}>HOW TO PLAY</div>
                        </div>
                    </div>
                </div>
                <div className="right-container-decoration">
                </div>
            </div>
        </div>

    );
};

export default DecorativeGameLobby;