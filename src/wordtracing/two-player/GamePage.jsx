import React, { useState, useEffect, useRef } from "react"
import timer from "../img/clock.png"
import "./Game.css"
import ProgressBar from "@ramonak/react-progress-bar";
import * as constants from "../../utils/Constants"
import Canvas from './component/Canvas';

function GamePage() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight*constants.HEIGHT_RATIO);

  const wordWrittenByUser = useRef(null);  //사용자가 쓴 글자
  const wordToTest = useRef(null);         //현재 사용자가 작성해야 하는 단어
  const indexOfwordList = useRef(0);       //단어목록에서 현재 사용자가 작성해야하는 단어의 인덱스값
  const score = useRef(0);                 //현재 점수

  const [isTesting, setIsTesting] = useState(!constants.IS_TESTING);

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

	return(
		<div className='word-tracing-play-container'>

			<div className='word-tracing-timer-container'>
        <div className='word-tracing-timer'>
          <div className='word-tracing-for-two-timer-gauge' style={{color: "white"}}>
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

			<div className='word-display-container'>
        <div style={{
          fontFamily: "Fredoka_One",
          color: "white",
          fontSize: "2em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          Apple
        </div>
			</div>

      <div className='word-tracing-for-two-score-container'>
        <div className='word-tracing-for-two-score-screen'>
          <div className='word-tracing-for-two-score'>
            score: 100
          </div>

          <div className='word-tracing-for-two-score'>
            score: 200
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
                    zIndex: "1"
                  }}/>
              </div>
            </div>
          </div>
          
          <div className='word-tracing-for-two-canvas'>
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"}}>
              <div style={{
                width: (window.innerHeight * constants.HEIGHT_RATIO * (4.0 / 3.0)), 
                height: windowHeight,
                marginLeft: "auto",
                position: "relative"}}>
                  {/* <Canvas
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
              </div>
            </div>
          </div>
        </div>
      </div> 
		</div>
	);
}

export default GamePage;