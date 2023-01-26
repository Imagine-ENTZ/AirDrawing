import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import "./WordTracing.scoped.css"

function WordTracingPage() {
  const navigate = useNavigate();

  return(
    <div className='word-tracing-container'>
      <div className='word-tracing-title'>
        <img className='word-tracing-title-img' src="img/word_logo.png"/>
      </div>
      <div className='word-tracing-button-list'>
        <div className='word-tracing-button'>
          <div className='word-tracing-play-button' onClick={() => navigate("/word-tracing/play")}>
            <img src="img/play.png"/>
          </div>
          <div className='word-tracing-play-button'>
            <img src="img/how_to_play.png"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordTracingPage;