import React, { useState, useEffect, useRef } from "react"
import "./Game.css"
import Canvas from "./component/Canvas"
import CheckSpinner from "./component/CheckSpinner"
import timer from "./img/clock.png"
// import handedMode from "./img/handed_mode.png"
import ProgressBar from "@ramonak/react-progress-bar";
import * as constants from "../utils/Constants"
import HandedMode from './component/HandedMode'

function GamePage() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight*constants.HEIGHT_RATIO);

  const wordWrittenByUser = useRef(null);  //사용자가 쓴 글자
  const wordToTest = useRef(null);         //현재 사용자가 작성해야 하는 단어
  const indexOfwordList = useRef(0);       //단어목록에서 현재 사용자가 작성해야하는 단어의 인덱스값
  const score = useRef(0);                 //현재 점수
  // const isTesting = useRef(!constants.IS_TESTING);
  const [isTesting, setIsTesting] = useState(!constants.IS_TESTING);

  useEffect(() => {
    if(wordWrittenByUser.current === null) {
      return;
    }

    if(wordWrittenByUser.current === wordList[indexOfwordList.current]){   //현재 화면에 표시된 단어와 사용자가 작성한 단어가 일치하는지를 확인함
      console.log("정답 -> 사용자["+wordWrittenByUser.current+"], 정답["+wordList[indexOfwordList.current]+"]");
      score.current += 100;
    }
    else{
      console.log("실패 -> 사용자["+wordWrittenByUser.current+"], 정답["+wordList[indexOfwordList.current]+"]");
    }

    setIsTesting(!constants.IS_TESTING);
    indexOfwordList.current += 1;
    wordToTest.current = wordList[indexOfwordList.current];

    console.log("index: " + indexOfwordList.current + ", current word: " + wordToTest.current);
  }, [wordWrittenByUser.current])
  
  //단어목록
  const wordList = ["apple", "Z", "cat", "Zoo", "b", "bread", "J"];

  useEffect(() => {
    wordToTest.current = wordList[0];
  }, [])

  const handleResize = () => {
    let height = window.innerHeight*constants.HEIGHT_RATIO;

    setWindowHeight(height);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }  
  }, [])

  const getLeftTime = () => {
    let second = seconds < 10 ? `0${seconds}` : seconds;

    return minutes + ":" + second;
    // "{minutes}:{seconds < 10 ? `0${seconds}` : seconds}"
  }

  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(minutes*60+seconds); //남은 시간
  const totalTime = useRef(minutes*60+seconds);  //게임의 총 시간

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
      setTimeLeft(minutes*60+seconds);
    }, 1000);

    if(timeLeft === 0){
      console.log("총 점수 : " + score);
    }
    
    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  return (    
    <div className='word-tracing-play-container'>

      <div className='word-tracing-timer-container'>
        <div className='word-tracing-timer'>
          <div className='word-tracing-timer-gauge' style={{color: "white"}}>
            {/* {minutes}:{seconds < 10 ? `0${seconds}` : seconds} // {timeLeft} */}
            <img className='word-tracing-timer-img' src={timer}/>
            
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

      <div className='word-tracing-score-container'>
        <div className='word-tracing-score'>
          score : {score.current}
        </div>
      </div>

      <div className='word-tracing-play-screen'>
        <div className='word-tracing-handed-mode-container'>
          <HandedMode />
        </div>
        <div className='word-tracing-sketckbook-container'>
          <div style={{
              width: "100%",
              height: "60%"
          }}>
            <div style={{
              width: (window.innerHeight * constants.HEIGHT_RATIO * (4.0 / 3.0)), 
              height: windowHeight,
              marginLeft: "auto",
              position: "relative"}}>
                <Canvas
                wordWrittenByUser={wordWrittenByUser}
                wordToTest={wordToTest}
                isTesting={isTesting}
                setIsTesting={setIsTesting}
                style={{ 
                  position: "absolute",
                  left: "0",
                  top: "0",
                  zIndex: "1"}}
                />
                <div style={{ 
                  position: "absolute",
                  left: "0",
                  top: "0",
                  width: (window.innerHeight * constants.HEIGHT_RATIO * (4.0 / 3.0)), 
                  height: windowHeight,
                  zIndex: "5"
                }}>
                  {isTesting && <CheckSpinner />}
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className='word-tracing-footer-container'>
        <div className='word-tracing-footer-title'>
          <div style={{
            fontFamily: "Silkscreen",
            fontSize: "2em",
            display: "flex"
          }}>
            Word Tracing
          </div>
          {/* <img className='word-tracing-footer-title-img' src={titleLog} /> */}
        </div>
      </div>
    </div>
  );

};

export default GamePage;