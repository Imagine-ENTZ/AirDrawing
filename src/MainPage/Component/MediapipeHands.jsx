import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import "./MediapipeHands.css"
import { detectHandGesture } from "./HandGesture";
import { preprocessImage } from "./PreprocessImage";
import frame from "./react-frame.png";
import * as constants from "../../utils/Constants";

import Tesseract from 'tesseract.js';

function MediapipeHands() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // 그리기 변수
  const canvasRef2 = useRef(null);
  const contextRef = useRef(null);
  const HandGesture = useRef(null);

  const preFingerPositionX = useRef(null);
  const preFingerPositionY = useRef(null);
  const [fingerPosition, setFingerPosition] = useState({
    x: 0,
    y: 0
  });

  // 프레임 변수
  const frameImage = new Image();
  frameImage.src = frame;

  //사각형 그리기 변수
  const canvasRef3 = useRef(null);
  const contextRef3 = useRef(null);

  const canvasOffSetX = useRef(null);
  const canvasOffSetY = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);
  const [isDrawing3, setIsDrawing3] = useState(false);

  // 캐릭터 변수
  const canvasRef4 = useRef(null);
  const contextRef4 = useRef(null);



  // // 사각형 캔버스 
  // useEffect(() => {
  //   const canvas = canvasRef3.current;
  //   canvas.height = constants.CANVAS_HEIGHT;
  //   canvas.width = constants.CANVAS_WIDTH;

  //   const context = canvas.getContext("2d");
  //   context.lineCap = "round";
  //   context.strokeStyle = "blue";
  //   context.lineWidth = 6;
  //   contextRef3.current = context;

  //   const canvasOffSet = canvas.getBoundingClientRect();

  //   console.log(canvasOffSet);
  //   canvasOffSetX.current = canvasOffSet.top;
  //   canvasOffSetY.current = canvasOffSet.left;
  // }, []);

  // 손그리기 캔버스
  useEffect(() => {
    let radius = 20;

    switch (HandGesture.current) {
      case constants.DRAW:
        console.log("DRAW");
        contextRef.current.fillStyle = "#"
        contextRef.current.beginPath();
        contextRef.current.moveTo(fingerPosition.x, fingerPosition.y);
        contextRef.current.lineTo(preFingerPositionX.current, preFingerPositionY.current);
        contextRef.current.stroke();
        contextRef.current.closePath();
        break;
      case constants.ERASE:
        console.log("ERASE");
        contextRef.current.save();
        contextRef.current.beginPath();
        contextRef.current.arc(fingerPosition.x, fingerPosition.y, radius, 0, 2 * Math.PI, true);
        contextRef.current.clip();
        contextRef.current.clearRect(fingerPosition.x - radius, fingerPosition.y - radius, radius * 2, radius * 2);
        contextRef.current.restore();
        break;
    }

    if (contextRef.current) {
      preFingerPositionX.current = fingerPosition.x;
      preFingerPositionY.current = fingerPosition.y;
    }

    //cam 화면을 벗어나면 
    if (fingerPosition.x < 125 || fingerPosition.x > constants.DRAWING_WIDTH + 125 || fingerPosition.y < 0 || fingerPosition.y > constants.DRAWING_HEIGHT) {
      preFingerPositionX.current = null;
      preFingerPositionY.current = null;
    }
  }, [fingerPosition]);

  // 단어 적는 프레임 
  useEffect(() => {
    const canvas = canvasRef3.current;
    canvas.height = constants.CANVAS_HEIGHT;
    canvas.width = constants.CANVAS_WIDTH;
    if (!canvasRef3) return;
    const ctx = canvasRef3.current.getContext("2d");
    frameImage.onload = function () {
      ctx.drawImage(frameImage, 125, 0); // 프레임 위치 나중에 손 봐야함
      console.log("width:" + frameImage.width + ", height:" + frameImage.height);
    };
  }, [canvasRef3]);

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

    const canvas = canvasRef2.current;
    canvas.height = constants.CANVAS_HEIGHT;
    canvas.width = constants.CANVAS_WIDTH;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 15;
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
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

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
      const x = calculateX(parseInt(constants.CANVAS_WIDTH - results.multiHandLandmarks[0][8].x * constants.CANVAS_WIDTH));
      const y = calculateY(parseInt(results.multiHandLandmarks[0][8].y * constants.CANVAS_HEIGHT));

      // 손가락 포인트 값
      // const x = parseInt(constants.CANVAS_WIDTH - results.multiHandLandmarks[0][8].x * constants.CANVAS_WIDTH);
      // const y = parseInt(results.multiHandLandmarks[0][8].y * constants.CANVAS_HEIGHT);

      HandGesture.current = detectHandGesture(results.multiHandLandmarks[0]);  //현재 그리기 모드
      setFingerPosition({ x: x, y: y });
    }
    canvasCtx.restore();
  };

  const calculateX = (beforeX) => {
    if (beforeX > constants.DRAWING_WIDTH + 125 || beforeX < 125) {
      beforeX = preFingerPositionX;
    }
    return beforeX;
  }

  const calculateY = (beforeY) => {
    if (beforeY > constants.DRAWING_HEIGHT || beforeY < 0) {
      beforeY = preFingerPositionY;
    }
    return beforeY;
  }

  // 이모지 넣어주는 함수 
  const setEmoji = (emojiName) => {
    const canvas = canvasRef4.current;
    canvas.height = constants.CANVAS_HEIGHT;
    canvas.width = constants.CANVAS_WIDTH;
    const ctx = canvas.getContext('2d'); 
  const image = new Image();

    image.src = "https://emojiapi.dev/api/v1/" + emojiName + "/50.png";
    image.onload = function () {
      ctx.drawImage(image, 125, 0);
      console.log("success!");
    }
  }

  

  // // 사각형 그리기 함수
  // const startDrawingRectangle = ({ nativeEvent }) => {
  //   nativeEvent.preventDefault();
  //   nativeEvent.stopPropagation();

  //   startX.current = nativeEvent.clientX - canvasOffSetY.current;
  //   startY.current = nativeEvent.clientY - canvasOffSetX.current;

  //   setIsDrawing3(true);
  // };

  // const drawRectangle = ({ nativeEvent }) => {
  //   if (!isDrawing3) {
  //     return;
  //   }

  //   nativeEvent.preventDefault();
  //   nativeEvent.stopPropagation();

  //   const newMouseX = nativeEvent.clientX - canvasOffSetY.current;
  //   const newMouseY = nativeEvent.clientY - canvasOffSetX.current;

  //   const rectWidht = newMouseX - startX.current;
  //   const rectHeight = newMouseY - startY.current;

  //   contextRef3.current.clearRect(0, 0, canvasRef3.current.width, canvasRef3.current.height);

  //   contextRef3.current.strokeRect(startX.current, startY.current, rectWidht, rectHeight);
  // };

  // const stopDrawingRectangle = () => {
  //   setIsDrawing3(false);
  //   canvasRef2.current.focus();
  // };

  // 이미지 저장
  const spaceDown = (e) => {
    if (e.key === ' ') {
      console.log("space click");
      //const image = canvasRef2.current.toDataURL("image/png"); // 이걸로 바로하면 흑백 처리 안됨
      //const image = converToGray();
      const image = preprocessImage(canvasRef2.current);

      // 이미지 저장
      // const a = document.createElement("a");
      // a.href = image;
      // a.setAttribute("download", "hong.png");
      // a.click();
      saveImage(image);
    }
  };

  const saveImage = (imgDataUrl) => {
    var blobBin = atob(imgDataUrl.split(',')[1]);	// base64 데이터 디코딩
    var array = [];
    for (var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }

    var file = new Blob([new Uint8Array(array)], { type: 'image/png' });	// Blob 생성
    const image = URL.createObjectURL(file);

    Tesseract.recognize(image, 'eng', {
      logger: (m) => {
        console.log(m);

      },
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        console.log("결과값 + " + result.data.text);
        setEmoji(result.data.text);
      });

    canvasRef2.current.getContext('2d').clearRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT); // 저장 후 지우기
  }

  return (
    <div>
      <Webcam
        className="webcam"
        audio={false}
        mirrored={true}
        ref={webcamRef}
        style={{
          position: "absolute",
          top: 100,
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zIndex: 9,
          width: constants.CANVAS_WIDTH,
          height: constants.CANVAS_HEIGHT,
        }}
      />
      <canvas
        ref={canvasRef}
        mirrored={true}
        style={{
          position: "absolute",
          top: 100,
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zIndex: 9,
          width: constants.CANVAS_WIDTH,
          height: constants.CANVAS_HEIGHT,
        }}>
      </canvas>
      <canvas
        className="canvas"
        ref={canvasRef2}
        mirrored={true}
        tabIndex={0}
        onKeyDown={spaceDown}
        style={{
          position: "absolute",
          top: 100,
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zIndex: 9,
          width: constants.CANVAS_WIDTH,
          height: constants.CANVAS_HEIGHT,
        }}>
      </canvas>

      <canvas
        ref={canvasRef3}
        // onMouseDown={startDrawingRectangle}
        // onMouseMove={drawRectangle}
        // onMouseUp={stopDrawingRectangle}
        // onMouseLeave={stopDrawingRectangle}
        style={{
          position: "absolute",
          top: 100,
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zIndex: 9,
          width: constants.CANVAS_WIDTH,
          height: constants.CANVAS_HEIGHT,
        }}>
      </canvas>

      <canvas
        ref={canvasRef4}
        
        style={{
          position: "absolute",
          top: 100,
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zIndex: 9,
          width: constants.CANVAS_WIDTH,
          height: constants.CANVAS_HEIGHT,
        }}>
      </canvas>

    </div>
  )
}

export default MediapipeHands;
