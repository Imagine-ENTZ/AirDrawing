import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import {
  drawConnectors,
  drawLandmarks,
} from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import "./MediapipeHands.css"

function MediapipeHands() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // 그리기 변수
  const canvasRef2 = useRef(null);
  const contextRef = useRef(null);

  const isDrawing = useRef(false);
  const [isDrawing1, setIsDrawing1] = useState(false);

  const preFingerPositionX = useRef(null);
  const preFingerPositionY = useRef(null);
  const [fingerPosition, setFingerPosition] = useState({
    x: 0,
    y: 0
  });

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
    canvas.height = 600;
    canvas.width = 800;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef3.current = context;

    const canvasOffSet = canvas.getBoundingClientRect();
    canvasOffSetX.current = canvasOffSet.top;
    canvasOffSetY.current = canvasOffSet.left;
  }, []);

  // 손그리기 캔버스
  useEffect(() => {
    if (preFingerPositionX.current != null && preFingerPositionY.current != null && isDrawing1 === true) {
      contextRef.current.moveTo(fingerPosition.x, fingerPosition.y);
      contextRef.current.lineTo(preFingerPositionX.current, preFingerPositionY.current);
      contextRef.current.stroke();
    }

    if (contextRef.current) {
      isDrawing.current = true;
      preFingerPositionX.current = fingerPosition.x;
      preFingerPositionY.current = fingerPosition.y;
    }
  }, [fingerPosition])

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1626903359/${file}`;
      }
    })
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }

    const canvas = canvasRef2.current;
    canvas.height = 600;
    canvas.width = 800;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "red";
    context.lineWidth = 8;
    contextRef.current = context;

    hands.onResults(onResults);

  }, []);

  const onResults = (results) => {
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    canvasElement.width = videoWidth;
    canvasElement.height = videoHeight;

    canvasCtx.save(); //현재상태를 저장
    canvasCtx.clearRect(0, 0, videoWidth, videoHeight);   // 직사각형 영역의 픽셀을 투명한 검은색으로 설정
    canvasCtx.translate(videoWidth, 0); // 비디오 가로만큼 이동해서 손그릴 캔버스를 웹캠과 일치하도록 설정
    canvasCtx.scale(-1, 1);  // 뒤집기 

    // 캔버스 이미지 그리기
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    // 손가락 부분 그리기
    if (results.multiHandLandmarks) {

      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { // 손가락 선
          color: "#00FF00",
          lineWidth: 1,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FFFFFF", lineWidth: 2 }); // 손가락 점
      }

      // 손가락 포인트 값
      const x = parseInt(800 - results.multiHandLandmarks[0][8].x * 800);
      const y = parseInt(results.multiHandLandmarks[0][8].y * 600);

      setFingerPosition({ x: x, y: y });
    }
    //save한 곳으로 이동
    canvasCtx.restore();
  };

  // 스페이스바 누르면 그리기
  const spaceDown = (e) => {

    if (e.key === ' ' && isDrawing1 === false) {
      console.log("start drawing");
      setIsDrawing1(true);
    }
    else if (e.key === ' ' && isDrawing1 === true) {
      console.log("stop drawing");
      setIsDrawing1(false);
    }
    else if (e.key === 'Enter') {
      console.log( "enter");
    }

  };


  // 사각형 그리기 함수
  const startDrawingRectangle = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    startX.current = nativeEvent.clientX - canvasOffSetX.current;
    startY.current = nativeEvent.clientY - canvasOffSetY.current;

    setIsDrawing3(true);
  };

  const drawRectangle = ({ nativeEvent }) => {
    if (!isDrawing3) {
      return;
    }

    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
    const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

    const rectWidht = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;

    contextRef3.current.clearRect(0, 0, canvasRef3.current.width, canvasRef3.current.height);

    contextRef3.current.strokeRect(startX.current, startY.current, rectWidht, rectHeight);
  };

  const stopDrawingRectangle = () => {
    setIsDrawing3(false);
    canvasRef2.current.focus();
  };


  return (
    <div>
      <Webcam
        className="webcam"
        audio={false}
        mirrored={true}
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zindex: 9,
          width: 800,
          height: 600,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zindex: 9,
          width: 800,
          height: 600,
        }}>
      </canvas>
      <canvas
        className="canvas"
        ref={canvasRef2}
        onKeyDown={spaceDown}
        tabIndex={0}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zindex: 9,
          width: 800,
          height: 600,
        }}>
      </canvas>
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
          width: 800,
          height: 600,
        }}>
      </canvas>
    </div>
  )
}

export default MediapipeHands;
