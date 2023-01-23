import React from "react";
import "./Decoration.css";

function Decoration() {
    const decoration_sentence = {
        0: 'Decorate\nCanvas\nAnd\nTake a picture'
    }

    return (
        <div className="main-container-decoration">
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
            <div className="left-container-decoration">
                <div className="left-top-container-decoration">
                    <div className="decoration-sentence">{decoration_sentence[0]}</div>
                </div>
                <div className="left-bottom-container-decoration">
                    <div className="decoration-button-list">
                        <div className="start-or-how-decoration">START</div>
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