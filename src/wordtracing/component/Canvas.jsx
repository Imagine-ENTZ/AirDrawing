import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import { detectHandGesture } from "../../MainPage/Component/HandGesture"
import * as constants from "../../utils/Constants"
import "../WordTracing.css"
import A from "../img/a.png" 

function Canvas() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // 그리기 변수
  const canvasRef2 = useRef(null);
  const contextRef = useRef(null);
  const HandGesture = useRef(null);

  //현재 시점 그리기 변수
  const pointOfContextRef = useRef(null);
  const pointOfCanvasRef = useRef(null);

  const preFingerPositionX = useRef(null);
  const preFingerPositionY = useRef(null);
  const [fingerPosition, setFingerPosition] = useState({
    x: null,
    y: null
  });

  //window size
  const [windowSize, setWindowSize] = useState({
      width: window.innerWidth*constants.WIDTH_RATIO,
      height: window.innerHeight*constants.HEIGHT_RATIO
  });

  // 손그리기 캔버스
  useEffect(() => {
    let radius = 20;

    if(HandGesture.current == constants.DRAW && (preFingerPositionX == null || preFingerPositionY == null)){
      return;
    }

    switch(HandGesture.current){
      case constants.DRAW:
        contextRef.current.beginPath();
        contextRef.current.moveTo(preFingerPositionX.current, preFingerPositionY.current);
        contextRef.current.lineTo(fingerPosition.x, fingerPosition.y);
        contextRef.current.stroke();
        contextRef.current.closePath();
        break;
      case constants.ERASE:
        contextRef.current.save();
        contextRef.current.beginPath();
        contextRef.current.arc(fingerPosition.x, fingerPosition.y, radius, 0, 2*Math.PI, true);
        contextRef.current.clip();
        contextRef.current.clearRect(fingerPosition.x - radius, fingerPosition.y - radius, radius*2, radius*2);
        contextRef.current.restore();
        break;
    }

    if (contextRef.current) {
      preFingerPositionX.current = fingerPosition.x;
      preFingerPositionY.current = fingerPosition.y;
    }

    //cam 화면을 벗어나면 
    if (contextRef.current && (fingerPosition.x <= 0 || fingerPosition.x >= windowSize.width
        || fingerPosition.y <= 0 || fingerPosition.y >= windowSize.height)) {
      preFingerPositionX.current = null;
      preFingerPositionY.current = null;
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

    canvasRef2.current.focus();
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: constants.CANVAS_WIDTH,
        height: constants.CANVAS_HEIGHT,
      });
      camera.start();
    }

    hands.onResults(onResults);

    const canvas = canvasRef2.current;
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "orange";
    context.lineWidth = 8;

    // let img = new Image();
    // img.src = A
    // img.onload = () => {
    //   context.drawImage(img, 0, 0, canvas.width, canvas.height);
    // }
    // context.fillRect(0, 0, canvas.width, canvas.height);

    contextRef.current = context;
    
    const pointOfCanvas = pointOfCanvasRef.current;
    pointOfCanvas.width = windowSize.width;
    pointOfCanvas.height = windowSize.height;
    const pointOfContext = pointOfCanvas.getContext("2d");
    // pointOfContext.lineCap = "round";
    // pointOfContext.strokeStyle = "orange";
    // pointOfContext.lineWidth = 8;
    pointOfContextRef.current = pointOfContext;
  }, []);

  //윈도우 화면 resize시 캔버스와
  const handleResize = () => {
    let width = window.innerWidth*constants.WIDTH_RATIO;
    let height = window.innerHeight*constants.HEIGHT_RATIO;

    setWindowSize({
      width: width,
      height: height
    });
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }  
  }, [])

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
      
      let x = parseInt(windowSize.width - results.multiHandLandmarks[0][8].x*windowSize.width);
      let y = parseInt(windowSize.height*results.multiHandLandmarks[0][8].y);

      HandGesture.current = detectHandGesture(results.multiHandLandmarks[0]);  //현재 그리기 모드
      setFingerPosition({ x: x, y: y });

      let radius = 20;

      pointOfContextRef.current.clearRect(0, 0, windowSize.width, windowSize.height);
      pointOfContextRef.current.beginPath();
      pointOfContextRef.current.arc(x, y, radius, 0, 2 * Math.PI, false);
      pointOfContextRef.current.lineWidth = 3;
      pointOfContextRef.current.strokeStyle = '#ffffff';
      pointOfContextRef.current.stroke();
      pointOfContextRef.current.closePath();
    }
    //save한 곳으로 이동
    canvasCtx.restore();

    // let radius = 20;
    // contextRef.current.strokeStyle = "orange"
    // contextRef.current.save();
    // contextRef.current.beginPath();
    // contextRef.current.arc(fingerPosition.x, fingerPosition.y, radius, 0, 2*Math.PI, true);
    // contextRef.current.clip();
    // contextRef.current.drawImage(fingerPosition.x - radius, fingerPosition.y - radius, radius*2, radius*2);
    // contextRef.current.restore();
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%"
      }}>
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcamRef}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          textAlign: "center",
          zindex: 9,
          width: "100%",
          height: "100%",
          // objectFit: "cover", 
          // objectPosition: "center"
        }}
      />
      <canvas
        ref={canvasRef}
        mirrored={true}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          textAlign: "center",
          zindex: 9,
          width: "100%",
          height: "100%",
          // objectFit: "cover", 
          // objectPosition: "center"
        }}>
      </canvas>
      <canvas
        ref={canvasRef2}
        mirrored={true}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          textAlign: "center",
          zindex: 9,
          width: "100%",
          height: "100%",
          // objectFit: "cover", 
          // objectPosition: "center"
        }}>
      </canvas>
      <canvas
        ref={pointOfCanvasRef}
        mirrored={true}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          textAlign: "center",
          zindex: 9,
          width: "100%",
          height: "100%",
          // objectFit: "cover", 
          // objectPosition: "center"
        }}>
      </canvas>
    </div>
  )
}

export default Canvas;
