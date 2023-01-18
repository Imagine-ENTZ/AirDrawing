import React from "react"
import "./WordTracing.css"
import Canvas from "./component/Canvas"

const myStyle = {
  backgroundColor: "yellow" , 
}

function WordTracingPage() {

  return (
    // <div style={myStyle}>
    <div className='word-tracing-container'>
      <div className='title'>
        <div className='title-text'>Word Tracing</div>
      </div>
      <div className='content'>
        <div style={{width:window.innerHeight * 0.65 * 1.3, height:window.innerHeight * 0.65, margin: "auto"}}>
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