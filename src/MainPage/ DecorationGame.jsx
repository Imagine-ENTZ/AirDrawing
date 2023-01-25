import React, {useEffect, useState } from "react";
import "./DecorationGame.css";
import GameScreen from "./Component/GameScreen";
import OnOff from "./img/on-off-button.png";

import * as constants from "./../utils/Constants"; 


function DecorationGame() {

    const [windowHeight, setWindowHeight] = useState(window.innerHeight * constants.GAME_SCREEN_HEIGHT_RATIO);

    const handleResize = () => {
        let height = window.innerHeight * constants.GAME_SCREEN_HEIGHT_RATIO;
        console.log(height)

        setWindowHeight(height);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return (
        <div className="main-container-decoration-game">
            <div className="top-container-decoration-game">
                <div className="best-top-container-decoration-game">
                    <div className="best-top-left-decoration-game">
                    <div className="emoji-record">
                        <span>Your Emoji : </span>
                    </div>
                    </div>
                    <div className="best-top-right-decoration-game">
                        <div className="on-off-button">
                        <img className="on-off-image" src={OnOff} alt="END"></img>
                        </div>
                    </div>
                </div>
                <div className="bottom-of-top-container-decoration-game">
                    <div className="decoration-game-sentence">
                        🐶Write Your Word and Make Emoji!🐰
                    </div>
                </div>
            </div>
            <div className="body-container-decoration-game">
                <div className="screen-admin">
                <div style={{ width: (window.innerHeight * constants.GAME_SCREEN_HEIGHT_RATIO * (4.0 / 3.0)), height: windowHeight, margin: "auto" }}>
                    <GameScreen />
                </div>
                </div>
            </div>
            <div className="bottom-container-decoration-game">
                <div className="top-of-bottom-container-decoration-game">
                    <div className="screen-capture-sentence">
                        <span>Do you want to capture your screen? </span>
                        <span>Click Me!</span>
                    </div>
                </div>

                <div className="bottom-of-bottom-container-decoration-game">

                </div>
            </div>

        </div>

    );
};

export default DecorationGame;