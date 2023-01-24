import React from "react";
import "./Decoration.css";
import StarRain from "./Component/StarRain.jsx";
import { useNavigate } from "react-router-dom";

function Decoration() {
    const navigate = useNavigate();

    const decoration_sentence = {
        0: 'Decorate\nCanvas\nAnd\nTake a picture'
    }

    return (
        <div className="main-container-decoration">
            <StarRain />
            <div className="left-container-decoration">
                <div className="left-top-container-decoration">
                    <div className="decoration-sentence">{decoration_sentence[0]}</div>
                </div>
                <div className="left-bottom-container-decoration">
                    <div className="decoration-button-list">
                        <div className="start-or-how-decoration" onClick={() => navigate("/decorate-game")}>START</div>
                        <div className="start-or-how-decoration">HOW TO PLAY</div>
                    </div>
                </div>
            </div>
            <div className="right-container-decoration">
            </div>
        </div>

    );
};

export default Decoration;