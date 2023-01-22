import React, { useState, useEffect, useRef } from "react"
import "./Game.css"
import Canvas from "./component/Canvas"
import timer from "./img/timer.png"
import score from "./img/score.png"
import titleLog from "./img/word_title_logo.png";
import handedMode from "./img/handed_mode.png"
import ProgressBar from "@ramonak/react-progress-bar";

// const myStyle = {
//   backgroundColor: "yellow" , 
// }



//   return (
//     // <div style={myStyle}>
//     <div className='word-tracing-container'>
//       <div className='title'>
//         <div className='title-text'>Word Tracing</div>
//       </div>
//       <div className='content'>
//         <div style={{
//           width: { windowHeight } * (4.0/3.0) ,
//           height: { windowHeight }

function GamePage() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight* 0.60);

  const handleResize = () => {
    let height = window.innerHeight* 0.60;
    console.log(height)

    setWindowHeight(height);
  }

  let progress = 0;
  let timerId = null;

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
    // <div style={myStyle}>
    // <div className='word-tracing-play-container'>
    //   <div className='title'>
    //     <div className='title-text'>Word Tracing</div>
    //   </div>
    //   <div className='content'>
    //     <div style={{width: (window.innerHeight * 0.65 * (4.0 / 3.0)), height:windowHeight, margin: "auto"}}>
    //       <Canvas/>
    //     </div>
    //   </div>
    //   <div className='footer'>
    //     <div className='footer-text'>Let's try it together</div>
    //   </div>
    // </div>
    
    <div className='word-tracing-play-container'>

      <div className='word-tracing-timer-container'>
        <div className='word-tracing-timer-class'>
          <div className='word-tracing-timer'>
            <img className='word-tracing-timer-img' src={timer}/>
          </div>
          <div className='word-tracing-timer-gauge' style={{color: "white"}}>
            {/* {minutes}:{seconds < 10 ? `0${seconds}` : seconds} */}
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
          <img className='word-tracing-score-img' src={score} />
        </div>
      </div>

      <div className='word-tracing-play-screen'>
        <div className='word-tracing-handed-mode-container'>
          <div className='word-tracing-handed-mode'>
            <img className='word-tracing-handed-mode-img' src={handedMode} />
          </div>
        </div>
        <div className='word-tracing-sketckbook'>
          <div style={{
              width: "100%",
              height: "60%",
          }}>
            <div style={{
              width: (window.innerHeight * 0.60 * (4.0 / 3.0)), 
              height:windowHeight,
              margin: "auto"}}>
              <Canvas/>
            </div>
          </div>
        </div>
      </div>

      <div className='word-tracing-footer-container'>
        <div className='word-tracing-footer-title'>
          <img className='word-tracing-footer-title-img' src={titleLog} />
        </div>
      </div>
    </div>
  );

};

export default GamePage;