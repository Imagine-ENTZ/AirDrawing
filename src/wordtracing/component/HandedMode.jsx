
import React, { useState, useEffect, useRef } from "react"
import drawMode from "../img/handedmode/draw_mode.png"
import eraseMode from "../img/handedmode/erase_mode.png"
import hoverMode from "../img/handedmode/hover_mode.png"
import okMode from "../img/handedmode/ok_mode.png"
import resetMode from "../img/handedmode/reset_mode.png"

function HandedMode() {
  const handedModeImageStyle = {
    position:"relative",
    height: "100%",
    objectFit: "contain",
    display: "flex"
  }

  const handedModeStyle={
    position:"relative",
    width: "100%",
    height: "20%",
    display: "flex"
  }

  const handedModeName={
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontFamily: "Silkscreen",
    fontSize: "1.5em"
  }

  return(
    <div style={{
      position:"relative",            
      width: "100%",
      height: "100%"
    }}>
      <div style={handedModeStyle}>
        <img style={handedModeImageStyle} src={okMode} alt="okMode"/>
        <div style={handedModeName}>Ok</div>
      </div>
      <div style={handedModeStyle}>
        <img style={handedModeImageStyle} src={drawMode} alt="drawMode"/>
        <div style={handedModeName}>Draw</div>
      </div>
      <div style={handedModeStyle}>
        <img style={handedModeImageStyle} src={eraseMode} alt="eraseMode"/>
        <div style={handedModeName}>Erase</div>
      </div>
      <div style={handedModeStyle}>
        <img style={handedModeImageStyle} src={resetMode} alt="resetMode"/>
        <div style={handedModeName}>Reset</div>
      </div>
      <div style={handedModeStyle}>
        <img style={handedModeImageStyle} src={hoverMode} alt="hoverMode"/>
        <div style={handedModeName}>Hover</div>
      </div>
    </div>
  );
}

export default HandedMode;