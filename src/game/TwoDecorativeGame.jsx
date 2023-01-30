import React, { useEffect, useState, useRef } from "react";
import "./TwoDecorativeGame.css";
import TwoGameScreen from "./component/twoplayer/TwoGameScreen.jsx";
import OnOff from "./img/on-off-button.png";
import StarRain from "./component/effect/StarRain.jsx";
import { useNavigate } from "react-router-dom";
import Loading from "./component/loading/Loading";

import * as constants from "../utils/Constants";

import { useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";


function TwoDecorativeGame() {

    const anotherVideoRef = useRef(null);
    const otherDrawingRef = useRef(null);
    const otherEmojiRef = useRef(null);


    /// 파라미터로 방 코드 받음
    const location = useLocation();
    const code = location.state.code;
    const sender = location.state.sender;

    const navigate = useNavigate();

    const [windowHeight, setWindowHeight] = useState(window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO);

    const handleResize = () => {
        let height = window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO;
        setWindowHeight(height);
    }

    const [isLoading, setIsLoading] = useState(true);

    const getVideo = (isLoading) => {
        console.log(isLoading);
    }

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

    const client = useRef({});


    const backClicked = () => {

        client.current.unsubscribe();
        client.current.deactivate();
        navigate("/lobby");
    }

    // 상대 이모지 개수 불러오기
    const [otherNumber, setOtherNumber] = useState(0);

    const getOtherData = (otherNumber) => {
        console.log(otherNumber);
    }

    const otherShapes = useRef([]);

    useEffect(() => {

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [])

    return (
        <div className="main-container-decoration-game-two">
            <StarRain />
            <div className="top-container-decoration-game-two">
                <div className="best-top-container-decoration-game-two">
                    <div className="best-top-left-decoration-game-two">
                    </div>
                    <div className="best-top-right-decoration-game-two">
                        <div className="on-off-button-two-decorative" onClick={backClicked}>
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
                                <TwoGameScreen
                                    getOtherData={setOtherNumber}
                                    getData={setNumber}
                                    getWord={setWord}
                                    getVideo={setIsLoading}
                                    ref={gameScreenRef}
                                    roomid={code}
                                    sender={Math.random().toString(36).substring(2, 11)}
                                    anotherVideoRef={anotherVideoRef}
                                    otherDrawingRef={otherDrawingRef}
                                    otherEmojiRef={otherEmojiRef}
                                    otherShapes={otherShapes}
                                    client={client} />
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
                        <Loading loading={isLoading}/>
                        <div style={{
                            position: "relative",
                            height: "100%"
                        }}>
                            <video
                                className="hong"
                                ref={anotherVideoRef}
                                autoPlay={true}
                                playsInline={true}
                                style={{
                                    position: "absolute",
                                    width: (window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO * (4.0 / 3.0)),
                                    height: windowHeight,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    top: "0",
                                    left: "0",
                                    right: "0",
                                    textAlign: "center",
                                    zIndex: 1,
                                    width: "100%",
                                    height: "100%",
                                    transform: "scaleX(-1)"
                                }}
                            />
                            <canvas
                                className="canvas"
                                ref={otherDrawingRef}
                                mirrored={true}
                                // tabIndex={0}s
                                //onKeyDown={f1Down}
                                style={{
                                    // background: "red",
                                    position: "absolute",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    left: "0",
                                    right: "0",
                                    textAlign: "center",
                                    zIndex: 9,
                                    width: (window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO * (4.0 / 3.0)),
                                    height: windowHeight,
                                }}>
                            </canvas>
                            <canvas
                                className="canvas"
                                ref={otherEmojiRef}
                                mirrored={true}
                                // tabIndex={0}s
                                //onKeyDown={f1Down}
                                style={{
                                    // background:"red",
                                    position: "absolute",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    left: "0",
                                    right: "0",
                                    textAlign: "center",
                                    zIndex: 11,
                                    width: (window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO * (4.0 / 3.0)),
                                    height: windowHeight,
                                }}>
                            </canvas>
                        </div>
                    </div>
                    <div className="bottom-of-right-container-decoration-game-two">
                        <div className="emoji-record-opponent">
                            <span>Opponent Emoji : </span><span>{otherNumber}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default TwoDecorativeGame;