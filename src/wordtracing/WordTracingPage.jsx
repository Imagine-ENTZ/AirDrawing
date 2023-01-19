import React, { useState, useEffect } from "react"
import "./WordTracing.css"
import Canvas from "./component/Canvas"

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

function WordTracingPage() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight* 0.65);

  const handleResize = () => {
    let height = window.innerHeight* 0.65;
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
    // <div style={myStyle}>
    <div className='word-tracing-container'>
      <div className='title'>
        <div className='title-text'>Word Tracing</div>
      </div>
      <div className='content'>
        <div style={{width: (window.innerHeight * 0.65 * (4.0 / 3.0)), height:windowHeight, margin: "auto"}}>
          <Canvas/>
        </div>
      </div>
      <div className='footer'>
        <div className='footer-text'>Let's try it together</div>
      </div>
    </div>

  );

};

export default WordTracingPage;