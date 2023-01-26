import React, { useState, useEffect, useRef } from "react"
import * as constants from "../../utils/Constants"
import loading from "../img/loading.png";
import failed from "../img/emotion/crying.png"
import incorrect from "../img/emotion/thinking.png"
import correct from "../img/emotion/laugh.png"

function CheckSpinner(props){

  const loadingStyle = {
    width: "auto",
    height: "20%",
    animationName: "rotator",
    animationIterationCount: "infinite",
    animationDuration: "2s"
  }

  const emotionStyle = {
    width: "auto",
    height: "20%"
  }

  const getSpinnerImage = () => {
    switch(props.spinnerType){
      case constants.LOADING:
        return <img src={loading} style={loadingStyle}/>;
      case constants.INCORRECTION:
        return <img src={incorrect} style={emotionStyle}/>;
      case constants.CORRECTION:
        return <img src={correct} style={emotionStyle}/>;
      case constants.FAILURE:
        return <img src={failed} style={emotionStyle}/>;
    }

    return null;
  }

  return(
    <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {getSpinnerImage()}
    </div>
  );
}

export default CheckSpinner;