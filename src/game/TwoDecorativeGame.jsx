import React, { useEffect, useState, useRef } from "react";
import "./TwoDecorativeGame.css";
import TwoGameScreen from "./component/TwoGameScreen";
import OnOff from "./img/on-off-button.png";
import TimerScreen from "./component/TimerScreen.jsx";
import StarRain from "./component/StarRain.jsx";
import { useNavigate } from "react-router-dom";

import * as constants from "../utils/Constants";

import { useLocation } from "react-router-dom";

function TwoDecorativeGame() {

    const anotherVideoRef = useRef(null);

    /// 파라미터로 방 코드 받음
    const location = useLocation();
    const code = location.state.code;
    const sender = location.state.sender;

    const navigate = useNavigate();

    const [windowHeight, setWindowHeight] = useState(window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO);

    const handleResize = () => {
        let height = window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO;
        console.log(height)

        setWindowHeight(height);
    }

    useEffect(() => {
        console.log(code);
        console.log(sender);

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
        <div className="main-container-decoration-game-two">
            <StarRain />
            <div className="top-container-decoration-game-two">
                <div className="best-top-container-decoration-game-two">
                    <div className="best-top-left-decoration-game-two">
                    </div>
                    <div className="best-top-right-decoration-game-two">
                        <div className="on-off-button-two-decorative" onClick={() => navigate("/lobby")}>
                            <img className="on-off-image-two-decorative" src={OnOff} alt="END"></img>
                        </div>
                    </div>
                </div>

                <div className="middle-top-container-decoration-game-two">
                    <div className="decoration-game-sentence-game-two">
                        🐶Write Your Word and Make Emoji!🐰
                    </div>
                </div>

                <div className="bottom-of-top-container-decoration-game-two">
                    <div className="screen-word-decoration-game-two">
                        {word}
                    </div>
                </div>

            </div>

            <div className="body-container-decoration-game-two">

                <div className="left-body-container-decoration-game-two">
                    <div className="body-container-of-left-decoration-game-two">
                        <div className="screen-admin-decoration-game-two">
                            <div style={{ width: (window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO * (4.0 / 3.0)), height: windowHeight, margin: "auto" }}>
                                <TwoGameScreen getData={setNumber} getWord={setWord} ref={gameScreenRef} roomid={code} sender={Math.random().toString(36).substring(2, 11)} anotherVideoRef={anotherVideoRef} />
                            </div>
                        </div>
                    </div>
                    <div className="bottom-of-left-container-decoration-game-two">
                        <div className="emoji-record-decoration-game-two">
                            <span>Your Emoji : </span><span>{number}</span>
                        </div>
                    </div>
                </div>

                <div className="right-body-container-decoration-game-two">
                    <div className="body-container-of-right-decoration-game-two">
                        <video
                            className="hong"
                            ref={anotherVideoRef}
                            autoPlay={true}
                            playsInline={true}
                            style={{ width: "800px", height: "600px" }}
                        />
                    </div>
                    <div className="bottom-of-right-container-decoration-game-two">
                        <div className="emoji-record-opponent">
                            <span>Opponent Emoji : </span><span>0</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default TwoDecorativeGame;