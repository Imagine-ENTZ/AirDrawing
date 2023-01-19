import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import "./MediapipeHands.css"
import { detectHandGesture } from "./HandGesture";
import frame from "./react-frame.png";
import * as constants from "../../utils/Constants";
import ReactCrop from 'react-image-crop';

import Tesseract from 'tesseract.js';
// import cv from "@techstark/opencv-js"


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

  // 사각형 캔버스 
  useEffect(() => {
    const canvas = canvasRef3.current;
    canvas.height = constants.CANVAS_HEIGHT;
    canvas.width = constants.CANVAS_WIDTH;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "blue";
    context.lineWidth = 6;
    contextRef3.current = context;

    const canvasOffSet = canvas.getBoundingClientRect();

    console.log(canvasOffSet);
    canvasOffSetX.current = canvasOffSet.top;
    canvasOffSetY.current = canvasOffSet.left;
  }, []);

  // 손그리기 캔버스
  useEffect(() => {
    let radius = 20;

    switch (HandGesture.current) {
      case constants.DRAW:
        contextRef.current.fillStyle = "#"
        contextRef.current.beginPath();
        contextRef.current.moveTo(fingerPosition.x, fingerPosition.y);
        contextRef.current.lineTo(preFingerPositionX.current, preFingerPositionY.current);
        contextRef.current.stroke();
        contextRef.current.closePath();
        break;
      case constants.ERASE:
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
    if (!canvasRef3) return;
    const ctx = canvasRef3.current.getContext("2d");
    //ctx.clearRect(0, 0, canvasRef2.current.width, canvasRef2.current.height);
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


  // 사각형 그리기 함수
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
    canvasRef2.current.focus();
  };

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
      });

    canvasRef2.current.getContext('2d').clearRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT); // 저장 후 지우기
  }

  // 흑백 처리 함수
  const converToGray = () => {
    const canvas = canvasRef2.current;
    const ctx = canvas.getContext('2d');

    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imgData.data;

    for (var i = 0; i < pixels.length; i += 4) {

      let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);

      pixels[i] = lightness;
      pixels[i + 1] = lightness;
      pixels[i + 2] = lightness;
    }
    //ctx.putImageData(imgData, 0, 0); 
    return canvas.toDataURL('image/png');
  }

  // 이미지 전처리
  const preprocessImage = (canvas) => {
    const level = 0.4;
    const radius = 1;
    const ctx = canvas.getContext('2d');
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    blurARGB(image.data, canvas, radius);
    dilate(image.data, canvas);
    //converToGray(image.data);
    invertColors(image.data);
    thresholdFilter(image.data, level);

    ctx.putImageData(image, 0, 0);

    // 오리는 것 까지 다 하기로..
    // Crop the canvas
    var cropX = 125;
    var cropY = 0;
    var cropWidth = constants.DRAWING_WIDTH;
    var cropHeight = constants.DRAWING_HEIGHT;

    // Create a new canvas to hold the cropped image
    var croppedCanvas = document.createElement("canvas");
    var croppedCtx = croppedCanvas.getContext("2d");
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;

    // Draw the cropped image on the new canvas
    croppedCtx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    return croppedCanvas.toDataURL('image/png');
    //return converToGray();
  }

  ////////////////////// 이미지 전처리
  function thresholdFilter(pixels, level) {
    if (level === undefined) {
      level = 0.5;
    }
    const thresh = Math.floor(level * 255);
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      let val;
      //if (gray >= thresh) {
      //  val = 255;
      //} else {
      val = 0;
      //}
      pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
    }
  }

  function getARGB(data, i) {
    const offset = i * 4;
    return (
      ((data[offset + 3] << 24) & 0xff000000) |
      ((data[offset] << 16) & 0x00ff0000) |
      ((data[offset + 1] << 8) & 0x0000ff00) |
      (data[offset + 2] & 0x000000ff)
    );
  };

  function setPixels(pixels, data) {
    let offset = 0;
    for (let i = 0, al = pixels.length; i < al; i++) {
      offset = i * 4;
      pixels[offset + 0] = (data[i] & 0x00ff0000) >>> 16;
      pixels[offset + 1] = (data[i] & 0x0000ff00) >>> 8;
      pixels[offset + 2] = data[i] & 0x000000ff;
      pixels[offset + 3] = (data[i] & 0xff000000) >>> 24;
    }
  };

  // internal kernel stuff for the gaussian blur filter
  let blurRadius;
  let blurKernelSize;
  let blurKernel;
  let blurMult;

  // from https://github.com/processing/p5.js/blob/main/src/image/filters.js
  function buildBlurKernel(r) {
    let radius = (r * 3.5) | 0;
    radius = radius < 1 ? 1 : radius < 248 ? radius : 248;

    if (blurRadius !== radius) {
      blurRadius = radius;
      blurKernelSize = (1 + blurRadius) << 1;
      blurKernel = new Int32Array(blurKernelSize);
      blurMult = new Array(blurKernelSize);
      for (let l = 0; l < blurKernelSize; l++) {
        blurMult[l] = new Int32Array(256);
      }

      let bk, bki;
      let bm, bmi;

      for (let i = 1, radiusi = radius - 1; i < radius; i++) {
        blurKernel[radius + i] = blurKernel[radiusi] = bki = radiusi * radiusi;
        bm = blurMult[radius + i];
        bmi = blurMult[radiusi--];
        for (let j = 0; j < 256; j++) {
          bm[j] = bmi[j] = bki * j;
        }
      }
      bk = blurKernel[radius] = radius * radius;
      bm = blurMult[radius];

      for (let k = 0; k < 256; k++) {
        bm[k] = bk * k;
      }
    }
  }

  // from https://github.com/processing/p5.js/blob/main/src/image/filters.js
  function blurARGB(pixels, canvas, radius) {
    const width = canvas.width;
    const height = canvas.height;
    const numPackedPixels = width * height;
    const argb = new Int32Array(numPackedPixels);
    for (let j = 0; j < numPackedPixels; j++) {
      argb[j] = getARGB(pixels, j);
    }
    let sum, cr, cg, cb, ca;
    let read, ri, ym, ymi, bk0;
    const a2 = new Int32Array(numPackedPixels);
    const r2 = new Int32Array(numPackedPixels);
    const g2 = new Int32Array(numPackedPixels);
    const b2 = new Int32Array(numPackedPixels);
    let yi = 0;
    buildBlurKernel(radius);
    let x, y, i;
    let bm;
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        cb = cg = cr = ca = sum = 0;
        read = x - blurRadius;
        if (read < 0) {
          bk0 = -read;
          read = 0;
        } else {
          if (read >= width) {
            break;
          }
          bk0 = 0;
        }
        for (i = bk0; i < blurKernelSize; i++) {
          if (read >= width) {
            break;
          }
          const c = argb[read + yi];
          bm = blurMult[i];
          ca += bm[(c & -16777216) >>> 24];
          cr += bm[(c & 16711680) >> 16];
          cg += bm[(c & 65280) >> 8];
          cb += bm[c & 255];
          sum += blurKernel[i];
          read++;
        }
        ri = yi + x;
        a2[ri] = ca / sum;
        r2[ri] = cr / sum;
        g2[ri] = cg / sum;
        b2[ri] = cb / sum;
      }
      yi += width;
    }
    yi = 0;
    ym = -blurRadius;
    ymi = ym * width;
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        cb = cg = cr = ca = sum = 0;
        if (ym < 0) {
          bk0 = ri = -ym;
          read = x;
        } else {
          if (ym >= height) {
            break;
          }
          bk0 = 0;
          ri = ym;
          read = x + ymi;
        }
        for (i = bk0; i < blurKernelSize; i++) {
          if (ri >= height) {
            break;
          }
          bm = blurMult[i];
          ca += bm[a2[read]];
          cr += bm[r2[read]];
          cg += bm[g2[read]];
          cb += bm[b2[read]];
          sum += blurKernel[i];
          ri++;
          read += width;
        }
        argb[x + yi] =
          ((ca / sum) << 24) |
          ((cr / sum) << 16) |
          ((cg / sum) << 8) |
          (cb / sum);
      }
      yi += width;
      ymi += width;
      ym++;
    }
    setPixels(pixels, argb);
  };

  function invertColors(pixels) {

    for (var i = 0; i < pixels.length; i += 4) {
      pixels[i] = pixels[i] ^ 255; // Invert Red
      pixels[i + 1] = pixels[i + 1] ^ 255; // Invert Green
      pixels[i + 2] = pixels[i + 2] ^ 255; // Invert Blue
    }
  }
  // from https://github.com/processing/p5.js/blob/main/src/image/filters.js
  function dilate(pixels, canvas) {
    let currIdx = 0;
    const maxIdx = pixels.length ? pixels.length / 4 : 0;
    const out = new Int32Array(maxIdx);
    let currRowIdx, maxRowIdx, colOrig, colOut, currLum;

    let idxRight, idxLeft, idxUp, idxDown;
    let colRight, colLeft, colUp, colDown;
    let lumRight, lumLeft, lumUp, lumDown;

    while (currIdx < maxIdx) {
      currRowIdx = currIdx;
      maxRowIdx = currIdx + canvas.width;
      while (currIdx < maxRowIdx) {
        colOrig = colOut = getARGB(pixels, currIdx);
        idxLeft = currIdx - 1;
        idxRight = currIdx + 1;
        idxUp = currIdx - canvas.width;
        idxDown = currIdx + canvas.width;

        if (idxLeft < currRowIdx) {
          idxLeft = currIdx;
        }
        if (idxRight >= maxRowIdx) {
          idxRight = currIdx;
        }
        if (idxUp < 0) {
          idxUp = 0;
        }
        if (idxDown >= maxIdx) {
          idxDown = currIdx;
        }
        colUp = getARGB(pixels, idxUp);
        colLeft = getARGB(pixels, idxLeft);
        colDown = getARGB(pixels, idxDown);
        colRight = getARGB(pixels, idxRight);

        //compute luminance
        currLum =
          77 * ((colOrig >> 16) & 0xff) +
          151 * ((colOrig >> 8) & 0xff) +
          28 * (colOrig & 0xff);
        lumLeft =
          77 * ((colLeft >> 16) & 0xff) +
          151 * ((colLeft >> 8) & 0xff) +
          28 * (colLeft & 0xff);
        lumRight =
          77 * ((colRight >> 16) & 0xff) +
          151 * ((colRight >> 8) & 0xff) +
          28 * (colRight & 0xff);
        lumUp =
          77 * ((colUp >> 16) & 0xff) +
          151 * ((colUp >> 8) & 0xff) +
          28 * (colUp & 0xff);
        lumDown =
          77 * ((colDown >> 16) & 0xff) +
          151 * ((colDown >> 8) & 0xff) +
          28 * (colDown & 0xff);

        if (lumLeft > currLum) {
          colOut = colLeft;
          currLum = lumLeft;
        }
        if (lumRight > currLum) {
          colOut = colRight;
          currLum = lumRight;
        }
        if (lumUp > currLum) {
          colOut = colUp;
          currLum = lumUp;
        }
        if (lumDown > currLum) {
          colOut = colDown;
          currLum = lumDown;
        }
        out[currIdx++] = colOut;
      }
    }
    setPixels(pixels, out);
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

      <canvas
        ref={canvasRef3}
        // onMouseDown={startDrawingRectangle}
        // onMouseMove={drawRectangle}
        // onMouseUp={stopDrawingRectangle}
        // onMouseLeave={stopDrawingRectangle}
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

    </div>
  )
}

export default MediapipeHands;
