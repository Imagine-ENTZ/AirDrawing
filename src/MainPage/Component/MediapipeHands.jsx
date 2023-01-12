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

  const canvasRef2 = useRef(null);
  const contextRef = useRef(null);
  // const [isDrawing, setIsDrawing] = useState(false);
  const isDrawing = useRef(false);
  const preFingerPositionX = useRef(null);
  const preFingerPositionY = useRef(null);

  const [fingerPosition, setFingerPosition] = useState({
    x : 0,
    y : 0
  });

  useEffect(() => {
    if(preFingerPositionX.current != null && preFingerPositionY.current != null){
      contextRef.current.moveTo(fingerPosition.x, fingerPosition.y);
      contextRef.current.lineTo(preFingerPositionX.current, preFingerPositionY.current);
      contextRef.current.stroke();
    }

    if(contextRef.current){
      // setIsDrawing(true);
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
    context.strokeStyle = "black";
    context.lineWidth = 5;
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
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FFFFFF", lineWidth: 2 }); // 손가락 점
      }

      // 손가락 포인트 값
      const x = parseInt(800 - results.multiHandLandmarks[0][8].x * 800);
      const y = parseInt(results.multiHandLandmarks[0][8].y * 600);
      
      // const z = results.multiHandLandmarks[0][8].z;
      setFingerPosition({x : x, y : y});
    }
    //save한 곳으로 이동
    canvasCtx.restore();
  };

  // const startDrawing = ({nativeEvent}) => {
  //     const {offsetX, offsetY} = nativeEvent;
  //     contextRef.current.beginPath();
  //     contextRef.current.moveTo(offsetX, offsetY);
  //     contextRef.current.lineTo(offsetX, offsetY);
  //     contextRef.current.stroke();
  //     // setIsDrawing(true);
  //     nativeEvent.preventDefault();
  // };

  // const draw = ({nativeEvent}) => {
  //     if(!isDrawing) {
  //         return;
  //     }
      
  //     const {offsetX, offsetY} = nativeEvent;
  //     contextRef.current.lineTo(offsetX, offsetY);
  //     contextRef.current.stroke();
  //     nativeEvent.preventDefault();
  // };

  // const stopDrawing = () => {
  //     contextRef.current.closePath();
  //     // setIsDrawing(false);
  // };

  // const setToDraw = () => {
  //     contextRef.current.globalCompositeOperation = 'source-over';
  // };

  // const setToErase = () => {
  //     contextRef.current.globalCompositeOperation = 'destination-out';
  // };

  // const saveImageToLocal = (event) => {
  //     let link = event.currentTarget;
  //     link.setAttribute('download', 'canvas.png');
  //     let image = canvasRef2.current.toDataURL('image/png');
  //     link.setAttribute('href', image);
  // };

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
              ref={canvasRef2}
              // onMouseDown={startDrawing}
              // onMouseMove={draw}
              // onMouseUp={stopDrawing}
              // onMouseLeave={stopDrawing}
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
          {/* <div>
              <button onClick={setToDraw}>
                  Draw
              </button>
              <button onClick={setToErase}>
                  Erase
              </button>
              <a id="download_image_link" href="download_link" onClick={saveImageToLocal}>Download Image</a>
          </div> */}
        </div>
    )
}

export default MediapipeHands;
