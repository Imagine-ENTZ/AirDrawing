import React, { useState, useEffect, useRef } from "react"
import "./Game.css"
import Canvas from "./component/Canvas"
import timer from "./img/timer.png"
import titleLog from "./img/word_title_logo.png";
import handedMode from "./img/handed_mode.png"
import ProgressBar from "@ramonak/react-progress-bar";
import * as constants from "../utils/Constants"

function GamePage() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight*constants.HEIGHT_RATIO);

  const wordWrittenByUser = useRef(null);  //사용자가 쓴 글자
  const isTesting = useRef(!constants.IS_TESTING);
  const indexOfwordList = useRef(0);  //단어목록에서 현재 사용자가 작성해야하는 단어의 인덱스값

  const getIsTesting = (test) => {
    isTesting.current = test;
  }

  useEffect(() => {

    if(wordWrittenByUser.current === "C"){ //현재 화면에 표시된 단어와 사용자가 작성한 단어가 일치하는지를 확인함
      console.log("정답 -> 사용자["+wordWrittenByUser.current+"], 정답["+wordList[indexOfwordList]+"]");
    }
    else{
      console.log("실패 -> 사용자["+wordWrittenByUser.current+"], 정답["+wordList[indexOfwordList]+"]");
    }

    indexOfwordList.current += 1;
    isTesting.current = !constants.IS_TESTING;
  }, [wordWrittenByUser.current])
  
  //단어목록
  const wordList = ["apple", "Z", "cat", "Zoo", "b", "bread", "J"];

  const handleResize = () => {
    let height = window.innerHeight*constants.HEIGHT_RATIO;

    setWindowHeight(height);
  }

  const score = useRef(0);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }  
  }, [])

  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);

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
    }, 1000);
    
    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  return (    
    <div className='word-tracing-play-container'>

      <div className='word-tracing-timer-container'>
        <div className='word-tracing-timer'>
          <div className='word-tracing-timer-gauge' style={{color: "white"}}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            <img className='word-tracing-timer-img' src={timer}/>
            <ProgressBar 
            className="word-tracing-timer-gauge-bar"
            completed={seconds}
            customLabel={seconds}
            maxCompleted={60} 
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
          <div className='word-tracing-handed-mode'>
            <img className='word-tracing-handed-mode-img' src={handedMode} />
          </div>
        </div>
        <div className='word-tracing-sketckbook-container'>
          <div style={{
              width: "100%",
              height: "60%",
          }}>
            <div style={{
              width: (window.innerHeight * constants.HEIGHT_RATIO * (4.0 / 3.0)), 
              height: windowHeight,
              margin: "auto"}}>
              <Canvas
              wordWrittenByUser={wordWrittenByUser}
              isTesting={isTesting.current}
              getIsTesting={getIsTesting}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='word-tracing-footer-container'>
        <div className='word-tracing-footer-title'>
          <div style={{
            fontFamily: "Silkscreen",
            fontSize: "2em",
            display: "flex",
            marginLeft: "auto",
            width: "20%"
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