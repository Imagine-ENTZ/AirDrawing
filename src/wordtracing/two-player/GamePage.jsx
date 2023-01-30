import React, { useState, useEffect, useRef } from "react"
import timer from "../img/clock.png"
import "./Game.css"
import ProgressBar from "@ramonak/react-progress-bar";
import * as constants from "../../utils/Constants"
import Canvas from './component/Canvas';
import OpponentCanvas from './component/OpponentCanvas';
import CheckSpinner from "../component/CheckSpinner"
import canvasPicture from "../img/canvas_with_transparent_bg.png"
import { detectHandGesture } from "../../game/component/HandGesture"

import { useLocation } from "react-router-dom";

function GamePage() {

  const anotherVideoRef = useRef(null);
  /// 파라미터로 방 코드 받음
  const location = useLocation();
  const code = location.state.code;
  const sender = location.state.sender;

  const [windowHeight, setWindowHeight] = useState(window.innerHeight * constants.HEIGHT_RATIO);

  const wordWrittenByUser = useRef(null);  //사용자가 쓴 글자
  const wordWrittenByOpponentUser = useRef(null);  //사용자가 쓴 글자
  const wordToTest = useRef(null);         //현재 사용자가 작성해야 하는 단어

  const indexOfwordList = useRef(0);       //단어목록에서 현재 사용자가 작성해야하는 단어의 인덱스값
  const userScore = useRef(0);             //현재 플레이어의 점수
  const opponentUserScore = useRef(0);     //상대 플레이어의 점수

  const [isTesting, setIsTesting] = useState(!constants.IS_TESTING);    //사용자의 정답 테스트 여부
  const [isOpponentTesting, setIsOpponentTesting] = useState(!constants.IS_TESTING);    //상대 유저의 정답 테스트 여부

  const wordList = ["red", "apple", "z", "cat", "Zoo", "b", "happy", "bread", "J", "ball", "car", "bird",
    "farm", "duck", "grape"];

  const incorrection = useRef(false);     //사용자의 정답여부
  const correction = useRef(false);
  const failure = useRef(false);

  const opponentIncorrection = useRef(false);  //상대 유저의 정답 여부
  const opponentCorrection = useRef(false);
  const opponentFailure = useRef(false);

  const loadingStyle = {
    position: "absolute",
    left: "0",
    top: "0",
    width: (window.innerHeight * constants.HEIGHT_RATIO * (4.0 / 3.0)),
    height: windowHeight,
    zIndex: "5"
  }

  //window size
  const [windowSize, setWindowSize] = useState({
    width: window.innerHeight * constants.HEIGHT_RATIO * (4.0 / 3.0),
    height: window.innerHeight * constants.HEIGHT_RATIO
  });

  //스팰링 도안 캔버스 변수
  const spellingArtOfCanvasRef = useRef(null);
  const spellingArtOfContextRef = useRef(null);

  useEffect(() => {
    //영어 단어 스펠링 도안 캔버스
    const spellingArtCanvas = spellingArtOfCanvasRef.current;
    spellingArtCanvas.width = windowSize.width;
    spellingArtCanvas.height = windowSize.height;

    const spellingArtOfContext = spellingArtCanvas.getContext("2d");

    let spellingArtImg = new Image();
    spellingArtImg.src = canvasPicture;

    if (!spellingArtOfContextRef) return;

    spellingArtImg.onload = () => {
      spellingArtOfContext.drawImage(
        spellingArtImg, 0, 0, spellingArtCanvas.width, spellingArtCanvas.height);
    }

    spellingArtOfContextRef.current = spellingArtOfContext;
  }, [])

  useEffect(() => {

    wordToTest.current = wordList[0];
  }, [])

  useEffect(() => {
    if (wordWrittenByUser.current === null) {
      return;
    }

    if (wordWrittenByUser.current.toUpperCase() === wordList[indexOfwordList.current].toUpperCase()) {   //현재 화면에 표시된 단어와 사용자가 작성한 단어가 일치하는지를 확인함
      console.log("정답 -> 사용자[" + wordWrittenByUser.current + "], 정답[" + wordList[indexOfwordList.current] + "]");
      correction.current = true;
      userScore.current += 100;
      indexOfwordList.current += 1;  //정답인 경우에만 다음 단어로 넘어감
      wordToTest.current = wordList[indexOfwordList.current];
    }
    else {
      console.log("오답 -> 사용자[" + wordWrittenByUser.current + "], 정답[" + wordList[indexOfwordList.current] + "]");
      incorrection.current = true;
    }

    wordWrittenByUser.current = null;   //사용자가 작성하는 단어 초기화
    setIsTesting(!constants.IS_TESTING);//사용자의 정답 판정이 끝남

    console.log("index: " + indexOfwordList.current + ", current word: " + wordToTest.current);
  }, [wordWrittenByUser.current])

  // useEffect(() => {
  //   if (wordWrittenByOpponentUser.current === null) {
  //     return;
  //   }

  //   if (wordWrittenByUser.current.toUpperCase() === wordList[indexOfwordList.current].toUpperCase()) {   //현재 화면에 표시된 단어와 사용자가 작성한 단어가 일치하는지를 확인함
  //     // console.log("정답 -> 사용자[" + wordWrittenByUser.current + "], 정답[" + wordList[indexOfwordList.current] + "]");
  //     correction.current = true;
  //     // userScore.current += 100;
  //     // indexOfwordList.current += 1;  //정답인 경우에만 다음 단어로 넘어감
  //     // wordToTest.current = wordList[indexOfwordList.current];
  //   }
  //   else {
  //     console.log("오답 -> 사용자[" + wordWrittenByUser.current + "], 정답[" + wordList[indexOfwordList.current] + "]");
  //     incorrection.current = true;
  //   }

  //   // wordWrittenByUser.current = null;   //사용자가 작성하는 단어 초기화
  //   // setIsTesting(!constants.IS_TESTING);//사용자의 정답 판정이 끝남

  //   // console.log("index: " + indexOfwordList.current + ", current word: " + wordToTest.current);
  // }, [wordWrittenByOpponentUser.current])  //상대 유저가 작성한 답


  const handleResize = () => {
    let height = window.innerHeight * constants.HEIGHT_RATIO;

    setWindowHeight(height);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  //손가락으로 캔버스에 그리는 변수(상대방의 손가락 좌표)
  const fingerOfcanvasRef = useRef(null);
  const fingerOfcontextRef = useRef(null);

  //직전의 손가락 위치(상대방의 손가락 좌표)
  const preFingerPositionX = useRef(null);
  const preFingerPositionY = useRef(null);
  const [fingerPosition, setFingerPosition] = useState({
    x: null,
    y: null
  });

  //상대방의 현재 그리기 모드
  const handGesture = useRef(constants.HOVER);
  const preHandGesture = useRef(constants.HOVER);

  useEffect(() => {
    //사용자 그리기 캔버스(상대방의 캔버스)
    const canvas = fingerOfcanvasRef.current;
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "orange";
    context.lineWidth = 8;

    fingerOfcontextRef.current = context;
  }, [])

  useEffect(() => {
    let radius = 20;

    if (handGesture.current == constants.DRAW && (preFingerPositionX == null || preFingerPositionY == null)) {
      return;
    }
    
    // if (isOtherUserTesting == constants.IS_TESTING) {  //상대 유저가 현재 정답판정중이라면 더 이상의 정답 판정 시도는 불가
    //   return;
    // }

    switch (handGesture.current) {
      case constants.DRAW:
        fingerOfcontextRef.current.beginPath();
        fingerOfcontextRef.current.moveTo(preFingerPositionX.current, preFingerPositionY.current);
        fingerOfcontextRef.current.lineTo(fingerPosition.x, fingerPosition.y);
        fingerOfcontextRef.current.stroke();
        fingerOfcontextRef.current.closePath();
        break;
      case constants.ERASE:
        fingerOfcontextRef.current.save();
        fingerOfcontextRef.current.beginPath();
        fingerOfcontextRef.current.arc(fingerPosition.x, fingerPosition.y, radius, 0, 2 * Math.PI, true);
        fingerOfcontextRef.current.clip();
        fingerOfcontextRef.current.clearRect(fingerPosition.x - radius, fingerPosition.y - radius, radius * 2, radius * 2);
        fingerOfcontextRef.current.restore();
        break;
    }
    //   case constants.OK:
    //     checkIfWordsMatch();
    //     break;
    // }

    if (fingerOfcontextRef.current) {
      preFingerPositionX.current = fingerPosition.x;
      preFingerPositionY.current = fingerPosition.y;
    }

    // console.log("현재 -> x: " + fingerPosition.x + ", y: " + fingerPosition.y);
  }, [fingerPosition])  //Canvas에서 makeOtherDrawing()실행 후 받아온 상대방의 8번 x, y좌표
  

  // //손가락으로 캔버스에 그리는 변수
  // const fingerOfcanvasRef = useRef(null);
  // const fingerOfcontextRef = useRef(null);

  // //현재 그리기 모드
  // const handGesture = useRef(constants.HOVER);
  // const preHandGesture = useRef(constants.HOVER);

  // //직전의 손가락 위치
  // const preFingerPositionX = useRef(null);
  // const preFingerPositionY = useRef(null);
  // const [fingerPosition, setFingerPosition] = useState({
  //   x: null,
  //   y: null
  // });

  // useEffect(() => {
  //   //사용자 그리기 캔버스
  //   const canvas = fingerOfcanvasRef.current;
  //   canvas.width = windowSize.width;
  //   canvas.height = windowSize.height;

  //   const context = canvas.getContext("2d");
  //   context.lineCap = "round";
  //   context.strokeStyle = "orange";
  //   context.lineWidth = 8;

  //   fingerOfcontextRef.current = context;
  // }, [])

  // // 손그리기 캔버스
  // useEffect(() => {
  //   let radius = 20;

  //   if (handGesture.current == constants.DRAW && (preFingerPositionX == null || preFingerPositionY == null)) {
  //     return;
  //   }

  //   if (isOpponentUserTesting == constants.IS_TESTING) {
  //     return;
  //   }

  //   switch (handGesture.current) {
  //     case constants.DRAW:
  //       fingerOfcontextRef.current.beginPath();
  //       fingerOfcontextRef.current.moveTo(preFingerPositionX.current, preFingerPositionY.current);
  //       fingerOfcontextRef.current.lineTo(fingerPosition.x, fingerPosition.y);
  //       fingerOfcontextRef.current.stroke();
  //       fingerOfcontextRef.current.closePath();
  //       break;
  //     case constants.ERASE:
  //       fingerOfcontextRef.current.save();
  //       fingerOfcontextRef.current.beginPath();
  //       fingerOfcontextRef.current.arc(fingerPosition.x, fingerPosition.y, radius, 0, 2 * Math.PI, true);
  //       fingerOfcontextRef.current.clip();
  //       fingerOfcontextRef.current.clearRect(fingerPosition.x - radius, fingerPosition.y - radius, radius * 2, radius * 2);
  //       fingerOfcontextRef.current.restore();
  //       break;
  //     case constants.OK:
  //       // checkIfWordsMatch();
  //       break;
  //   }

  //   if (fingerOfcontextRef.current) {
  //     preFingerPositionX.current = fingerPosition.x;
  //     preFingerPositionY.current = fingerPosition.y;
  //   }
  // }, [fingerPosition])

  // const getCurrentHandGesture = () => {
  //   switch (handGesture.current) {
  //     case constants.DRAW:
  //       return "Draw";
  //     case constants.ERASE:
  //       return "Erase";
  //     case constants.OK:
  //       return "Ok";
  //     default:
  //       return "Hover";
  //   }
  // }

  const getLeftTime = () => {
    let second = seconds < 10 ? `0${seconds}` : seconds;

    return minutes + ":" + second;
    // "{minutes}:{seconds < 10 ? `0${seconds}` : seconds}"
  }

  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(minutes * 60 + seconds); //남은 시간
  const totalTime = useRef(minutes * 60 + seconds);  //게임의 총 시간

  useEffect(() => {
    const countdown = setInterval(() => {
      if (parseInt(seconds) > 0) {
        setSeconds(parseInt(seconds) - 1);
      }
      if (parseInt(seconds) === 0) {
        if (parseInt(minutes) === 0) {
          clearInterval(countdown);
        } else {
          setMinutes(parseInt(minutes) - 1);
          setSeconds(59);
        }
      }
      setTimeLeft(minutes * 60 + seconds);
    }, 1000);

    if (timeLeft === 0) {
      console.log("총 점수 : " + userScore);
    }

    return () => clearInterval(countdown);
  }, [minutes, seconds]);


  const setEmotion = () => {

    if (isTesting) {
      return <CheckSpinner spinnerType={constants.LOADING} />;
    }

    if (incorrection.current) {
      showEmojiDuringOneSecond(incorrection);
      return <CheckSpinner spinnerType={constants.INCORRECTION} />;
    }

    if (correction.current) {
      showEmojiDuringOneSecond(correction);
      return <CheckSpinner spinnerType={constants.CORRECTION} />;
    }

    if (failure.current) {
      showEmojiDuringOneSecond(failure);
      return <CheckSpinner spinnerType={constants.FAILURE} />;
    }
    return null;
  }

  const showEmojiDuringOneSecond = (isShow) => {
    setTimeout(function () {
      isShow.current = false;
    }, 1000);
  }

  return (
    <div className='word-tracing-play-container'>

      <div className='word-tracing-timer-container'>
        <div className='word-tracing-timer'>
          <div className='word-tracing-for-two-timer-gauge' style={{ color: "white" }}>
            {/* {minutes}:{seconds < 10 ? `0${seconds}` : seconds} // {timeLeft} */}
            <img className='word-tracing-timer-img' src={timer} />

            <ProgressBar
              className="word-tracing-timer-gauge-bar"
              completed={timeLeft}
              customLabel={getLeftTime()}
              maxCompleted={totalTime.current}
              barContainerClassName="bar-container"
              labelColor="black"
              labelAlignment="center"
              transitionDuration="1s"
              bgColor="#FFBDBC"
            />
          </div>
        </div>
      </div>

      <div className='word-display-container'>
        <div style={{
          fontFamily: "Fredoka_One",
          color: "#fdad1a",
          fontSize: "4em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {wordToTest.current}
        </div>
      </div>

      <div className='word-tracing-for-two-score-container'>
        <div className='word-tracing-for-two-score-screen'>
          <div className='word-tracing-for-two-score'>
            score: {userScore.current}
          </div>

          <div className='word-tracing-for-two-score'>
            score: {opponentUserScore.current}
          </div>
        </div>
      </div>

      <div className='word-tracing-for-two-play-container'>
        <div className='word-tracing-for-two-play'>
          <div className='word-tracing-for-two-canvas'>
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <div style={{
                width: (window.innerHeight * constants.HEIGHT_RATIO * (4.0 / 3.0)),
                height: windowHeight,
                marginLeft: "auto",
                position: "relative"
              }}>
                <Canvas
                  wordWrittenByUser={wordWrittenByUser}   //현재 유저의 그리기 변수
                  wordToTest={wordToTest}
                  isTesting={isTesting}
                  setIsTesting={setIsTesting}

                  roomid={code}    //stomp, webRTC 연결 변수
                  sender={Math.random().toString(36).substring(2, 11)} 
                  anotherVideoRef={anotherVideoRef}

                  fingerPosition={fingerPosition}         //상대방의 손가락 좌표
                  setFingerPosition={setFingerPosition}
                  preHandGesture={preHandGesture}         //상대방의 그리기 모드(draw, erase ..)
                  handGesture={handGesture}

                  style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    zIndex: "1"
                  }} />
                <div style={loadingStyle}>
                  {setEmotion()}
                </div>
              </div>
            </div>
          </div>

          <div className='word-tracing-for-two-canvas'>
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <div style={{
                width: (window.innerHeight * constants.HEIGHT_RATIO * (4.0 / 3.0)),
                height: windowHeight,
                marginLeft: "auto",
                position: "relative"
              }}>
                <video
                  className="hong"
                  ref={anotherVideoRef}
                  autoPlay={true}
                  playsInline={true}
                  style={{
                    transform: "scaleX(-1)"
                  }}
                />
                {/* <div 
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    textAlign: "center",
                    zIndex: 1,
                    width: "100%",
                    height: "100%"
                  }}> */}
                  {/* <OpponentCanvas
                    wordWrittenByUser={wordWrittenByUser}
                    wordToTest={wordToTest}
                    isTesting={isTesting}
                    setIsTesting={setIsTesting}
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "0",
                      zIndex: "1"
                    }}/> */}
                {/* </div> */}
                <canvas
                  ref={fingerOfcanvasRef}
                  mirrored={true}
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    textAlign: "center",
                    zIndex: 3,
                    width: "100%",
                    height: "100%"
                  }}>
                </canvas>
                <canvas
                  ref={spellingArtOfCanvasRef}
                  mirrored={true}
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    textAlign: "center",
                    zIndex: 1,
                    width: "100%",
                    height: "100%"
                  }}>
                </canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;