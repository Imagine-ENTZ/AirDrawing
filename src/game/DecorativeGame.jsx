import React, { useEffect, useState, useRef } from "react";
import "./DecorativeGame.css";
import GameScreen from "./component/GameScreen";
import OnOff from "./img/on-off-button.png";
import TimerScreen from "./component/timer/TimerScreen.jsx";
import StarRain from "./component/effect/StarRain.jsx";
import { useNavigate } from "react-router-dom";

import * as constants from "../utils/Constants";


function DecorativeGame(props) {
    const navigate = useNavigate();

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

    // 모달창 (타이머)
    const [isOpen, setIsOpen] = useState(false);

    const onClickButton = () => {
        setIsOpen(true);
    };

    // 자식 함수 데려오기
    const gameScreenRef = useRef();

    // useEffect(() => {
    //     gameScreenRef.current.captureImage();
    // }, []);

    // 이모지 개수 재주기
    const [number, setNumber] = useState(0);

    const getData = (number) => {
        //setNumber(number);
        console.log(number);
    }

    // 쓰여진 단어 알려주기
    const [word, setWord] = useState("Your Word Here!");

    const getWord = (word) => {
        console.log(word);
    }

    return (
        <div className="main-container-decoration-game">
            <StarRain />
            <div className="top-container-decoration-game">
                <div className="best-top-container-decoration-game">
                    <div className="best-top-left-decoration-game">
                        <div className="emoji-record">
                            <span>Your Emoji : </span><span>{number}</span>
                        </div>
                    </div>
                    <div className="best-top-right-decoration-game">
                        <div className="on-off-button" onClick={() => navigate("/decorative")}>
                            <img className="on-off-image" src={OnOff} alt="END"></img>
                        </div>
                    </div>
                </div>
                <div className="middle-top-container-decoration-game">
                    <div className="screen-word-decoration-game">
                        {word}
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
                        <GameScreen getData={setNumber} getWord={setWord} ref={gameScreenRef} />
                    </div>
                </div>
            </div>
            <div className="bottom-container-decoration-game">
                <div className="top-of-bottom-container-decoration-game">
                    <div className="screen-capture-sentence">
                        <span>Do you want to capture your screen? </span>
                        <span className="click-word-decoration-game" onClick={onClickButton}>Click Me!</span>
                        {isOpen && (<TimerScreen
                            open={isOpen}
                            onClose={() => {
                                setIsOpen(false);
                                gameScreenRef.current.captureImage();
                            }}
                        />)}
                    </div>
                </div>

                <div className="bottom-of-bottom-container-decoration-game">

                </div>
            </div>

        </div>

    );
};

export default DecorativeGame;