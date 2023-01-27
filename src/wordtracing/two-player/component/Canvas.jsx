import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import { detectHandGesture } from "../../../game/component/HandGesture"
import * as constants from "../../../utils/Constants"
import "../Game.css"
import canvasPicture from "../../img/canvas_with_transparent_bg.png"
import Tesseract from 'tesseract.js';
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

function Canvas(props) {
  const isTesting = useRef(!constants.IS_TESTING);  //현재 단어의 정답 여부를 테스트 중인지 관리

  const sendWordToParentComponent = (text) => {
    text = text.split("\n").join("");
    text = text.split(' ').join('');
    // console.log("사용자가 쓴 글씨 : [" + text + "]")
    props.wordWrittenByUser.current = text;   //사용자가 작성한 영어단어 전달
  }

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //손가락으로 캔버스에 그리는 변수
  const fingerOfcanvasRef = useRef(null);
  const fingerOfcontextRef = useRef(null);

  //현재 그리기 모드
  const handGesture = useRef(constants.HOVER);
  const preHandGesture = useRef(constants.HOVER);

  //스팰링 도안 캔버스 변수
  const spellingArtOfCanvasRef = useRef(null);
  const spellingArtOfContextRef = useRef(null);

  //현재 시점 그리기 변수
  const pointOfContextRef = useRef(null);
  const pointOfCanvasRef = useRef(null);

  //직전의 손가락 위치
  const preFingerPositionX = useRef(null);
  const preFingerPositionY = useRef(null);
  const [fingerPosition, setFingerPosition] = useState({
    x: null,
    y: null
  });

  //window size
  const [windowSize, setWindowSize] = useState({
    width: window.innerHeight * constants.HEIGHT_RATIO * (4.0 / 3.0),
    height: window.innerHeight * constants.HEIGHT_RATIO
  });

  useEffect(() => {
    //영어 단어 스펠링 도안 캔버스
    const spellingArtCanvas = spellingArtOfCanvasRef.current;
    spellingArtCanvas.width = windowSize.width;
    spellingArtCanvas.height = windowSize.height;

    const spellingArtOfContext = spellingArtCanvas.getContext("2d");

    let spellingArtImg = new Image();
    spellingArtImg.src = canvasPicture;

    if (!spellingArtOfContextRef) return;

    spellingArtImg.onload = () => {
      spellingArtOfContext.drawImage(
        spellingArtImg, 0, 0, spellingArtCanvas.width, spellingArtCanvas.height);
    }

    spellingArtOfContextRef.current = spellingArtOfContext;
  }, [])

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

    fingerOfcanvasRef.current.focus();
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

    //사용자 그리기 캔버스
    const canvas = fingerOfcanvasRef.current;
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "orange";
    context.lineWidth = 8;

    fingerOfcontextRef.current = context;

    //현재 8번 포인트가 가리키는 지점 표시
    const pointOfCanvas = pointOfCanvasRef.current;
    pointOfCanvas.width = windowSize.width;
    pointOfCanvas.height = windowSize.height;

    const pointOfContext = pointOfCanvas.getContext("2d");
    pointOfContextRef.current = pointOfContext;

    pointOfContext.lineCap = "round";
    pointOfContext.strokeStyle = "orange";
    pointOfContext.lineWidth = 8;
  }, []);

  //윈도우 화면 resize시 캔버스와
  const handleResize = () => {
    let height = window.innerHeight * constants.HEIGHT_RATIO;
    let width = height * (4.0 / 3.0);

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

  // 손그리기 캔버스
  useEffect(() => {
    let radius = 20;

    if (handGesture.current == constants.DRAW && (preFingerPositionX == null || preFingerPositionY == null)) {
      return;
    }

    if (props.isTesting == constants.IS_TESTING) {
      return;
    }

    switch (handGesture.current) {
      case constants.DRAW:
        fingerOfcontextRef.current.beginPath();
        fingerOfcontextRef.current.moveTo(preFingerPositionX.current, preFingerPositionY.current);
        fingerOfcontextRef.current.lineTo(fingerPosition.x, fingerPosition.y);
        fingerOfcontextRef.current.stroke();
        fingerOfcontextRef.current.closePath();
        // webRTC
        const obj = {
          "startX": fingerPosition.x,
          "startY": fingerPosition.y,
          "lastX": preFingerPositionX.current,
          "lastY": preFingerPositionY.current,
        }
        if (dataChannel.current != null)
          dataChannel.current.send(JSON.stringify(obj));
        break;
      case constants.ERASE:
        fingerOfcontextRef.current.save();
        fingerOfcontextRef.current.beginPath();
        fingerOfcontextRef.current.arc(fingerPosition.x, fingerPosition.y, radius, 0, 2 * Math.PI, true);
        fingerOfcontextRef.current.clip();
        fingerOfcontextRef.current.clearRect(fingerPosition.x - radius, fingerPosition.y - radius, radius * 2, radius * 2);
        fingerOfcontextRef.current.restore();
        break;
      case constants.OK:
        checkIfWordsMatch();
        break;
    }

    if (fingerOfcontextRef.current) {
      preFingerPositionX.current = fingerPosition.x;
      preFingerPositionY.current = fingerPosition.y;
    }
  }, [fingerPosition])

  const getCurrentHandGesture = () => {
    switch (handGesture.current) {
      case constants.DRAW:
        return "Draw";
      case constants.ERASE:
        return "Erase";
      case constants.OK:
        return "Ok";
      default:
        return "Hover";
    }
  }

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

      let x = parseInt(windowSize.width - results.multiHandLandmarks[0][8].x * windowSize.width);
      let y = parseInt(windowSize.height * results.multiHandLandmarks[0][8].y);

      preHandGesture.current = handGesture.current;
      handGesture.current = detectHandGesture(results.multiHandLandmarks[0]);  //현재 그리기 모드

      let radius = 10;

      //현재 8번으로 포인트되는 지점 표시
      pointOfContextRef.current.clearRect(0, 0, windowSize.width, windowSize.height);
      pointOfContextRef.current.beginPath();
      pointOfContextRef.current.arc(x, y, radius, 0, 2 * Math.PI, false);
      // pointOfContextRef.current.fillStyle = contextRef.current.strokeStyle;
      // pointOfContextRef.current.fillRect();
      pointOfContextRef.current.lineWidth = 3;
      pointOfContextRef.current.strokeStyle = "rgb(207, 145, 255)";
      pointOfContextRef.current.stroke();
      pointOfContextRef.current.closePath();

      setFingerPosition({ x: x, y: y });
    }
    //save한 곳으로 이동
    canvasCtx.restore();
  };

  //사용자가 적은 단어와 제시된 단어의 일치 여부 확인
  const checkIfWordsMatch = () => {
    //아직 이전의 결과를 테스트 중인 경우 중복 테스트가 되는 것을 방지함
    if (isTesting.current == constants.IS_TESTING) {
      return;
    }

    props.setIsTesting(constants.IS_TESTING);   //현재 테스트중임을 gamepage에 알림 -> 확인중 아이콘을 띄움
    isTesting.current = constants.IS_TESTING;

    const image = fingerOfcanvasRef.current.toDataURL("image/png");
    saveImage(image);
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
        // console.log(m);

      },
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        isTesting.current = !constants.IS_TESTING;
        sendWordToParentComponent(result.data.text);  //부모 컴포넌트에 사용자가 쓴 단어 텍스트값 보내기
        // console.log("결과값: " + result.data.text)

        fingerOfcontextRef.current.clearRect(0, 0, windowSize.width, windowSize.height); //검사 완료 후 글씨쓴 캔버스 초기화
      });

  }

  /////////////////////////////////////////////////////////




  const videoRef = useRef(null);
  // const anotherVideoRef = useRef(null);
  const client = useRef({});

  let stream;
  let myPeerConnection;


  const dataChannel = useRef();

  // function1
  const subscribe = () => {


    console.log(props.roomid, props.sender)

    client.current.subscribe(
      `/sub/play/${props.roomid}`,
      async ({ body }) => {
        const data = JSON.parse(body);
        // console.log(body);
        console.log("내이름은" + props.sender);
        switch (data.type) {
          case 'ENTER':
            if (data.sender !== props.sender) {
              console.log("sneder  " + data.sender);
              const offer = await myPeerConnection.createOffer();
              console.log("@@offer : ", (offer));
              myPeerConnection.setLocalDescription(offer);
              client.current.publish({
                destination: `/pub/play`,
                body: JSON.stringify({
                  type: 'OFFER',
                  room_id: props.roomid,//param.roomId,
                  sender: props.sender,
                  offer: JSON.stringify(offer),
                }),
              });
              console.log("진입" + offer + "그리더 : " + props.sender)
              console.log('오퍼전송');

            }
            break;

          case 'OFFER':
            if (data.sender !== props.sender) {
              console.log('오퍼수신');
              myPeerConnection.setRemoteDescription(JSON.parse(data.offer));
              const answer = await myPeerConnection.createAnswer();
              myPeerConnection.setLocalDescription(answer);
              client.current.publish({
                destination: `/pub/play`,
                body: JSON.stringify({
                  type: 'ANSWER',
                  room_id: props.roomid,//param.roomId,
                  sender: props.sender,
                  answer: JSON.stringify(answer),
                }),
              });
              console.log('엔서전송');
            }
            break;
          case 'ANSWER':
            if (data.sender !== props.sender) {
              console.log('엔서수신');
              myPeerConnection.setRemoteDescription(JSON.parse(data.answer));
            }
            break;
          case 'ICE':
            if (data.sender !== props.sender) {
              console.log("아이스 수신 값 : " + data.ice);
              myPeerConnection.addIceCandidate(JSON.parse(data.ice));
            }
            break;
          default:
        }
      },
    );
  };

  //function2
  const connect = () => {
    client.current = new StompJs.Client({
      webSocketFactory: () => new SockJS(constants.SOCKET_JS),

      debug: function (str) {
        console.log(str);
      },
      // reconnectDelay: 5000,
      // heartbeatIncoming: 4000,
      // heartbeatOutgoing: 4000,
      onConnect: () => {
        subscribe();
        client.current.publish({
          destination: `/pub/play`,
          body: JSON.stringify({
            type: 'ENTER',
            room_id: props.roomid,//param.roomId,
            sender: props.sender,
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
  //function3
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
  //function4
  function handleIce(data) {
    client.current.publish({
      destination: `/pub/play`,
      body: JSON.stringify({
        type: 'ICE',
        room_id: props.roomid,//param.roomId,
        sender: props.sender,
        ice: JSON.stringify(data.candidate),
      }),
    });
    console.log('아이스전송', data.candidate);
  }
  //function5
  function handleAddStream(data) {
    props.anotherVideoRef.current.srcObject = data.stream;
    console.log('got an stream from my peer');
    console.log("Peer's Stream", data.stream);
    console.log('My stream', stream);
  }
  //function6
  function handleChannel(event) {
    dataChannel.current = event.channel;
  }
  //function7
  function makeOtherDrawing(event) {
    console.log("받은 문자의 내용 : " + event.data);
    const obj = JSON.parse(event.data);

    // contextRef.current.beginPath();
    // contextRef.current.moveTo(obj.startX, obj.startY);
    // contextRef.current.lineTo(obj.lastX, obj.lastY);
    // contextRef.current.stroke();
    // contextRef.current.closePath();
  }
  //function8
  async function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [constants.STUN_SERVER],
          username: "guest",
          credential: "somepassword",
        },
        {
          urls: [constants.TURN_SERVER],
          username: "guest",
          credential: "somepassword",
        }
      ],
    });

    myPeerConnection.addEventListener('icecandidate', handleIce);
    myPeerConnection.addEventListener('addstream', handleAddStream); // 스트림 받기
    myPeerConnection.addEventListener('datachannel', handleChannel);
    stream.getTracks().forEach((track) => {
      myPeerConnection.addTrack(track, stream);
    });
  }
  //function9
  async function makeMessageConnection() {
    dataChannel.current = await myPeerConnection.createDataChannel("chat", { reliable: true });

    dataChannel.current.addEventListener("error", (error) => console.log("데이터채널의 오류 : " + error));
    dataChannel.current.addEventListener("close", () => console.log("데이터채널의 닫김"));
    dataChannel.current.addEventListener("open", () => console.log("데이터채널 열림"));
    dataChannel.current.addEventListener("message", makeOtherDrawing);

  }
  //function10
  async function fetchData() {
    await getMedia();
    makeConnection();
    connect();
    makeMessageConnection();
  }
  //function11
  useEffect(() => {
    fetchData();

  }, []);



  return (
    <div
      style={{
        position: "relative",
        height: "100%",
      }}>
      {/* <div style={{
        textShadow: "-2px 0 #000, 0 2px #000, 2px 0 #000, 0 -2px #000",
        position: "absolute", 
        width:"100%",
        height: "65%",
        bottom: "0",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        fontSize: "500%",
        fontFamily: "Fredoka_One",
        zIndex: 2,
        color: "white",
      }}>
        { props.wordToTest.current }
      </div> */}
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcamRef}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          textAlign: "center",
          zIndex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: '(0, 0, 0, 0.5)'
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
          zIndex: 1,
          width: "100%",
          height: "100%"
        }}>
      </canvas>
      <canvas
        ref={fingerOfcanvasRef}
        mirrored={true}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          textAlign: "center",
          zIndex: 3,
          width: "100%",
          height: "100%"
        }}>
      </canvas>
      <canvas
        ref={spellingArtOfCanvasRef}
        mirrored={true}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          textAlign: "center",
          zIndex: 1,
          width: "100%",
          height: "100%"
        }}>
      </canvas>
      <canvas
        ref={pointOfCanvasRef}
        mirrored={true}
        tabIndex={0}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          textAlign: "center",
          zIndex: 4,
          width: "100%",
          height: "100%"
        }}>
      </canvas>
    </div>
  )
}

export default Canvas;
