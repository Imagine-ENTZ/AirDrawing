import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import "./MediapipeHands.css"

import { detectHandGesture } from "./HandGesture"
import * as constants from "../../utils/Constants"

import Tesseract from 'tesseract.js';

import DrawRectangle from "./DrawRectangle";

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


  // 손그리기 캔버스
  useEffect(() => {
    switch (HandGesture.current) {
      case constants.DRAW:
        contextRef.current.beginPath();
        contextRef.current.moveTo(fingerPosition.x, fingerPosition.y);
        contextRef.current.lineTo(preFingerPositionX.current, preFingerPositionY.current);
        contextRef.current.stroke();
        contextRef.current.closePath();
        break;
      // case constants.ERASE:
      //   console.log("ERASE");
      //   contextRef.current.clearRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
      //   contextRef.current.fillStyle = "rgb(255, 255, 255)";
      //   contextRef.current.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
      //   break;
    }

    if (contextRef.current) {
      preFingerPositionX.current = fingerPosition.x;
      preFingerPositionY.current = fingerPosition.y;
    }

    //cam 화면을 벗어나면 
    if (fingerPosition.x < 0 || fingerPosition.x > constants.CANVAS_WIDTH || fingerPosition.y < 0 || fingerPosition.y > constants.CANVAS_HEIGHT) {
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

    
    const canvas = canvasRef2.current;
    canvas.height = constants.CANVAS_HEIGHT;
    canvas.width = constants.CANVAS_WIDTH;

    const context = canvas.getContext("2d");
    context.globalAlpha = 0.1;
    context.lineCap = "round";
    context.strokeStyle = "blue";
    context.lineWidth = 4;
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
      const x = parseInt(constants.CANVAS_WIDTH - results.multiHandLandmarks[0][8].x * constants.CANVAS_WIDTH);
      const y = parseInt(results.multiHandLandmarks[0][8].y * constants.CANVAS_HEIGHT);

      HandGesture.current = detectHandGesture(results.multiHandLandmarks[0]);  //현재 그리기 모드
      setFingerPosition({ x: x, y: y });
    }
    //save한 곳으로 이동
    canvasCtx.restore();
  };


  // 이미지 저장
  const spaceDown = (e) => {
    if (e.key === ' ') {
      console.log("space click");
      const image = canvasRef2.current.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = image;
      a.setAttribute("download", "hong.png");
      a.click();
      saveImage(image);
    }

  };

  const saveImage = (imgDataUrl) => {
  
    var blobBin = atob(imgDataUrl.split(',')[1]);	// base64 데이터 디코딩
    var array = [];
    for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }

    var file = new Blob([new Uint8Array(array)], {type: 'image/png'});	// Blob 생성
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
      });
 

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
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zindex: 9,
          width: constants.CANVAS_WIDTH,
          height: constants.CANVAS_HEIGHT,
        }}
      />
      <canvas
        ref={canvasRef}
        mirrored={true}
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
      
      <canvas
        className="canvas"
        ref={canvasRef2}
        mirrored={true}
        tabIndex={0}
        onKeyDown={spaceDown}
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
      <DrawRectangle/>
      
    </div>
  )
}

export default MediapipeHands;
