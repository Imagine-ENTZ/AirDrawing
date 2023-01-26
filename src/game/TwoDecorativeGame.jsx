import React, { useEffect, useState, useRef } from "react";
import "./TwoDecorativeGame.css";
import TwoGameScreen from "./component/TwoGameScreen";
import OnOff from "./img/on-off-button.png";
import TimerScreen from "./component/TimerScreen.jsx";
import StarRain from "./component/StarRain.jsx";
import { useNavigate } from "react-router-dom";

import * as constants from "../utils/Constants";

import { useLocation } from "react-router-dom";

import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

function TwoDecorativeGame() {



    const navigate = useNavigate();

    const [windowHeight, setWindowHeight] = useState(window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO);

    const handleResize = () => {
        let height = window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO;
        console.log(height)

        setWindowHeight(height);
    }

    useEffect(() => {


        fetchData();

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



    ///////////////////////////////////



    /// 파라미터로 방 코드 받음
    const location = useLocation();
    const roomid = location.state.code;
    // const sender =  location.state.sender;

    const sender = Math.random().toString(36).substring(2, 11);

    const videoRef = useRef(null);
    const anotherVideoRef = useRef(null);
    const client = useRef({});

    let stream;
    let myPeerConnection;


    const dataChannel = useRef();

    // function1
    const subscribe = () => {

        console.log("방번호는 " + roomid + "샌더" + sender);

        client.current.subscribe(
            `/sub/play/${roomid}`,
            async ({ body }) => {
                const data = JSON.parse(body);
                // console.log(body);
                // console.log("내이름은" + sender);
                switch (data.type) {
                    case 'ENTER':
                        if (data.sender !== sender) {
                            console.log("sneder  " + data.sender);
                            const offer = await myPeerConnection.createOffer();
                            console.log("@@offer : ", (offer));
                            myPeerConnection.setLocalDescription(offer);
                            client.current.publish({
                                destination: `/pub/play`,
                                body: JSON.stringify({
                                    type: 'OFFER',
                                    room_id: roomid,//param.roomId,
                                    sender: sender,
                                    offer: JSON.stringify(offer),
                                }),
                            });
                            console.log("진입" + offer + "그리더 : " + sender)
                            console.log('오퍼전송');

                        }
                        break;

                    case 'OFFER':
                        if (data.sender !== sender) {
                            console.log('오퍼수신');
                            myPeerConnection.setRemoteDescription(JSON.parse(data.offer));
                            const answer = await myPeerConnection.createAnswer();
                            myPeerConnection.setLocalDescription(answer);
                            client.current.publish({
                                destination: `/pub/play`,
                                body: JSON.stringify({
                                    type: 'ANSWER',
                                    room_id: roomid,//param.roomId,
                                    sender: sender,
                                    answer: JSON.stringify(answer),
                                }),
                            });
                            console.log('엔서전송');
                        }
                        break;
                    case 'ANSWER':
                        if (data.sender !== sender) {
                            console.log('엔서수신');
                            myPeerConnection.setRemoteDescription(JSON.parse(data.answer));
                        }
                        break;
                    case 'ICE':
                        if (data.sender !== sender) {
                            console.log("아이스 수신 " + data.sender + " " + data.ice);
                            myPeerConnection.addIceCandidate(JSON.parse(data.ice));
                        }
                        break;
                    default:
                }
            },
        );
    };

    //function2
    const connect = () => {
        client.current = new StompJs.Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/play"),

            debug: function (str) {
                console.log(str);
            },
            // reconnectDelay: 5000,
            // heartbeatIncoming: 4000,
            // heartbeatOutgoing: 4000,
            onConnect: () => {
                subscribe();
                client.current.publish({
                    destination: `/pub/play`,
                    body: JSON.stringify({
                        type: 'ENTER',
                        room_id: roomid,//param.roomId,
                        sender: sender,
                    }),
                });
            },
            onStompError: (frame) => {
                console.log(`Broker reported error: ${frame.headers.message}`);
                console.log(`Additional details: ${frame.body}`);
            },
        });
        client.current.activate();

    };
    //function3
    const getMedia = async () => {
        try {
            // 컴퓨터의 카메라 장치만 가져옴
            stream = await navigator.mediaDevices.getUserMedia({

                audio: true,
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

        } catch (e) {
            console.error(e);
        }

    };
    //function4
    function handleIce(data) {
        client.current.publish({
            destination: `/pub/play`,
            body: JSON.stringify({
                type: 'ICE',
                room_id: roomid,//param.roomId,
                sender: sender,
                ice: JSON.stringify(data.candidate),
            }),
        });
        console.log('아이스전송 ', data.sender + " " + data);
    }
    //function5
    function handleAddStream(data) {
        anotherVideoRef.current.srcObject = data.stream;
        console.log('got an stream from my peer');
        console.log("Peer's Stream", data.stream);
        console.log('My stream', stream);
    }
    //function6
    function handleChannel(event) {
        dataChannel.current = event.channel;
    }
    //function7
    function makeOtherDrawing(event) {
        console.log("받은 문자의 내용 : " + event.data);
        const obj = JSON.parse(event.data);

        // contextRef.current.beginPath();
        // contextRef.current.moveTo(obj.startX, obj.startY);
        // contextRef.current.lineTo(obj.lastX, obj.lastY);
        // contextRef.current.stroke();
        // contextRef.current.closePath();
    }
    //function8
    async function makeConnection() {
        myPeerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302',
                        'stun:stun1.l.google.com:19302',
                        'stun:stun2.l.google.com:19302',
                        'stun:stun3.l.google.com:19302',
                        'stun:stun4.l.google.com:19302',
                    ],
                },
            ],
        });

        myPeerConnection.addEventListener('icecandidate', handleIce);
        myPeerConnection.addEventListener('addstream', handleAddStream); // 스트림 받기
        myPeerConnection.addEventListener('datachannel', handleChannel);
        stream.getTracks().forEach((track) => {
            myPeerConnection.addTrack(track, stream);
        });
    }
    //function9
    async function makeMessageConnection() {
        dataChannel.current = await myPeerConnection.createDataChannel("chat", { reliable: true });

        dataChannel.current.addEventListener("error", (error) => console.log("데이터채널의 오류 : " + error));
        dataChannel.current.addEventListener("close", () => console.log("데이터채널의 닫김"));
        dataChannel.current.addEventListener("open", () => console.log("데이터채널 열림"));
        dataChannel.current.addEventListener("message", makeOtherDrawing);

    }
    //function10
    async function fetchData() {
        await getMedia();
        makeConnection();
        connect();
        makeMessageConnection();
    }
    //function11
    // useEffect(() => {
    //     fetchData();

    // }, []);




    return (
        <div className="main-container-decoration-game-two">
            <StarRain />
            <div className="top-container-decoration-game-two">
                <div className="best-top-container-decoration-game-two">
                    <div className="best-top-left-decoration-game-two">
                    </div>
                    <div className="best-top-right-decoration-game-two">
                        <div className="on-off-button-two-decorative" onClick={() => navigate("/2p-decorative")}>
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
                                <TwoGameScreen getData={setNumber} getWord={setWord} ref={gameScreenRef} />
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
                            // className="hong"
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