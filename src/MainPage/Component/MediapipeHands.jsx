import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import "./MediapipeHands.css"

import { detectHandGesture } from "./HandGesture"
import * as constants from "../../utils/Constants"

import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

function MediapipeHands({ roomid, sender }) {

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
    let radius = 20;


    switch (HandGesture.current) {

      case constants.DRAW:
        contextRef.current.beginPath();
        contextRef.current.moveTo(fingerPosition.x, fingerPosition.y);
        contextRef.current.lineTo(preFingerPositionX.current, preFingerPositionY.current);
        contextRef.current.stroke();
        contextRef.current.closePath();
        const obj = {
          "startX": fingerPosition.x,
          "startY": fingerPosition.y,
          "lastX": preFingerPositionX.current,
          "lastY": preFingerPositionY.current,
        }
        if (dataChannel.current)
          dataChannel.current.send(JSON.stringify(obj));




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
    context.lineCap = "round";
    context.strokeStyle = "blue";
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
      const x = parseInt(constants.CANVAS_WIDTH - results.multiHandLandmarks[0][8].x * constants.CANVAS_WIDTH);
      const y = parseInt(results.multiHandLandmarks[0][8].y * constants.CANVAS_HEIGHT);

      HandGesture.current = detectHandGesture(results.multiHandLandmarks[0]);  //현재 그리기 모드
      setFingerPosition({ x: x, y: y });
    }
    //save한 곳으로 이동
    canvasCtx.restore();
  };



  /////////////////////////////

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
    







  const muteBtn = useRef(null);
  const cameraBtn = useRef(null);
  const videoRef = useRef(null);
  const anotherVideoRef = useRef(null);

  const client = useRef({});

  let muted = false;
  let cameraOff = false;
  let stream;
  let myPeerConnection;

  const dataChannel = useRef();


  const subscribe = () => {

    client.current.subscribe(
      `/sub/gameroom/${roomid}`,
      async ({ body }) => {
        const data = JSON.parse(body);
        // console.log(body);
        switch (data.type) {
          case 'ENTER':
            if (data.sender !== sender) {
              console.log("sneder  " + data.sender);
              const offer = await myPeerConnection.createOffer();
              console.log("@@offer : ", (offer));
              myPeerConnection.setLocalDescription(offer);
              client.current.publish({
                destination: `/pub/gameroom/${roomid}`,
                body: JSON.stringify({
                  type: 'OFFER',
                  room_id: roomid,//param.roomId,
                  sender: sender,
                  offer: JSON.stringify(offer),
                }),
              });
              console.log("진입" + offer + "그리거 " + sender)
              console.log('오퍼전송');

            }
            break;

          case 'OFFER':
            if (data.sender !== sender) {
              console.log('오퍼수신');
              myPeerConnection.setRemoteDescription(JSON.parse(data.offer));
              const answer = await myPeerConnection.createAnswer();
              myPeerConnection.setLocalDescription(answer);
              client.current.publish({
                destination: `/pub/gameroom/${roomid}`,
                body: JSON.stringify({
                  type: 'ANSWER',
                  room_id: roomid,//param.roomId,
                  sender: sender,
                  answer: JSON.stringify(answer),
                }),
              });
              console.log('엔서전송');
            }
            break;
          case 'ANSWER':
            if (data.sender !== sender) {
              console.log('엔서수신');
              myPeerConnection.setRemoteDescription(JSON.parse(data.answer));
            }
            break;
          case 'ICE':
            if (data.sender !== sender) {
              console.log("아이스 수신 " + data.sender + " " + data.ice);
              myPeerConnection.addIceCandidate(JSON.parse(data.ice));
            }
            break;
          default:
        }
      },

    );
  };
  const connect = () => {
    client.current = new StompJs.Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/gameroom"),

      debug: function (str) {
        // console.log(str);
      },
      // reconnectDelay: 5000,
      // heartbeatIncoming: 4000,
      // heartbeatOutgoing: 4000,
      onConnect: () => {
        subscribe();
        client.current.publish({
          destination: `/pub/gameroom/${roomid}`,
          body: JSON.stringify({
            type: 'ENTER',
            room_id: roomid,//param.roomId,
            sender: sender,
          }),
        });
      },
      onStompError: (frame) => {
        console.log(`Broker reported error: ${frame.headers.message}`);
        console.log(`Additional details: ${frame.body}`);
      },
    });
    client.current.activate();

  };
  const disconnect = () => {
    client.current.deactivate();
  };

  function onClickCameraOffHandler() {
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    if (!cameraOff) {
      cameraBtn.current.innerText = 'OFF';
      cameraOff = !cameraOff;
    } else {
      cameraBtn.current.innerText = 'ON';
      cameraOff = !cameraOff;
    }
  }
  function onClickMuteHandler() {
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    if (!muted) {
      muteBtn.current.innerText = 'Unmute';
      muted = !muted;
    } else {
      muteBtn.current.innerText = 'Mute';
      muted = !muted;
    }
  }

  const getMedia = async () => {
    try {
      // 컴퓨터의 카메라 장치만 가져옴
      stream = await navigator.mediaDevices.getUserMedia({

        audio: true,
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.error(e);
    }

  };

  function handleIce(data) {
    client.current.publish({
      destination: `/pub/gameroom/${roomid}`,
      body: JSON.stringify({
        type: 'ICE',
        room_id: roomid,//param.roomId,
        sender: sender,
        ice: JSON.stringify(data.candidate),
      }),
    });
    console.log('아이스전송 ', data.sender + " " + data);
  }

  function handleAddStream(data) {
    anotherVideoRef.current.srcObject = data.stream;
    console.log('got an stream from my peer');
    console.log("Peer's Stream", data.stream);
    console.log('My stream', stream);
  }

  function handleChannel(event) {
    dataChannel.current = event.channel;
  }

  function clickSend() {
    console.log("전송됨 ");
    dataChannel.current.send("문자가 전송된다잉");
  }


  function makeOtherDrawing(event) {
    console.log("받은 문자의 내용 : " + event.data);
    const obj = JSON.parse(event.data);


    contextRef.current.beginPath();
    contextRef.current.moveTo(obj.startX, obj.startY);
    contextRef.current.lineTo(obj.lastX, obj.lastY);
    contextRef.current.stroke();
    contextRef.current.closePath();

    // contextRef3.current.clearRect(0, 0, canvasRef3.current.width, canvasRef3.current.height);
    // contextRef3.current.strokeRect(obj.startX, obj.startY, obj.lastX, obj.lastY);
  }
  async function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
    });

    myPeerConnection.addEventListener('icecandidate', handleIce);
    myPeerConnection.addEventListener('addstream', handleAddStream); // 스트림 받기
    myPeerConnection.addEventListener('datachannel', handleChannel);
    stream.getTracks().forEach((track) => {
      myPeerConnection.addTrack(track, stream);
    });
  }

  async function makeMessageConnection() {
    dataChannel.current = await myPeerConnection.createDataChannel("chat", { reliable: true });

    dataChannel.current.addEventListener("error", (error) => console.log("데이터채널의 오류 : " + error));
    dataChannel.current.addEventListener("close", () => console.log("데이터채널의 닫김"));
    dataChannel.current.addEventListener("open", () => console.log("데이터채널 열림"));
    dataChannel.current.addEventListener("message", makeOtherDrawing);

  }

  async function fetchData() {
    await getMedia();
    makeConnection();
    connect();
    makeMessageConnection();
  }
  useEffect(() => {
    fetchData();

  }, []);




  return (
    <div>
      <div className="top">

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
          style={{
            position: "absolute",
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
      <div className="bottom">
        <button ref={muteBtn} onClick={onClickMuteHandler}>
          Mute
        </button>
        <button ref={cameraBtn} onClick={onClickCameraOffHandler}>
          camera OFF
        </button>
        <button onClick={() => client.current.deactivate()}>
          나가기
        </button>
        <button
          onClick={clickSend}>
          문자보내기
        </button>
        <video
          ref={anotherVideoRef}
          autoPlay={true}
          playsInline={true}
          style={{ width: "800px", height: "600px" }}
        />
      </div>

    </div>
  )
}

export default MediapipeHands;
