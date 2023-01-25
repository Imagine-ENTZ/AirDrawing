import React, { useState, useEffect, useRef } from "react"
import loading from "../img/loading.png";

function CheckSpinner(){
  return(
    <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <img 
        src={loading}
        style={{
          width: "auto",
          height: "20%",
          animationName: "rotator",
          animationIterationCount: "infinite",
          animationDuration: "2s"
        }}/>
    </div>
  );
}

export default CheckSpinner;