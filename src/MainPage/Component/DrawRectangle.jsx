import React, { useRef, useEffect, useState } from "react";
import * as constants from "../../utils/Constants"

function DrawRectangle() {

    //사각형 그리기 변수
  const canvasRef3 = useRef(null);
  const contextRef3 = useRef(null);

  const canvasOffSetX = useRef(null);
  const canvasOffSetY = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);
  const [isDrawing3, setIsDrawing3] = useState(false);

  // 사각형 캔버스 
  useEffect(() => {
    const canvas = canvasRef3.current;
    canvas.height = constants.CANVAS_HEIGHT;
    canvas.width = constants.CANVAS_WIDTH;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef3.current = context;

    const canvasOffSet = canvas.getBoundingClientRect();

    console.log(canvasOffSet);
    canvasOffSetX.current = canvasOffSet.top;
    canvasOffSetY.current = canvasOffSet.left;
  }, []);

  const startDrawingRectangle = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    startX.current = nativeEvent.clientX - canvasOffSetY.current;
    startY.current = nativeEvent.clientY - canvasOffSetX.current;

    setIsDrawing3(true);
  };

  const drawRectangle = ({ nativeEvent }) => {
    if (!isDrawing3) {
      return;
    }

    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    const newMouseX = nativeEvent.clientX - canvasOffSetY.current;
    const newMouseY = nativeEvent.clientY - canvasOffSetX.current;

    const rectWidht = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;


    contextRef3.current.clearRect(0, 0, canvasRef3.current.width, canvasRef3.current.height);

    contextRef3.current.strokeRect(startX.current, startY.current, rectWidht, rectHeight);
  };

  const stopDrawingRectangle = () => {
    setIsDrawing3(false);
    // canvasRef2.current.focus();
  };

  return (
   <canvas
        ref={canvasRef3}
        onMouseDown={startDrawingRectangle}
        onMouseMove={drawRectangle}
        onMouseUp={stopDrawingRectangle}
        onMouseLeave={stopDrawingRectangle}

        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zindex: 9,
          width: constants.CANVAS_WIDTH,
          height: constants.CANVAS_HEIGHT,
        }}>
      </canvas>
  )
}

export default DrawRectangle