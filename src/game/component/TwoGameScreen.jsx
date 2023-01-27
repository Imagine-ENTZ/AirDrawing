import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import "./MediapipeHands.css"
import { detectHandGesture } from "./HandGesture";
import { preprocessImage } from "./PreprocessImage";
import frame from "./frame.png";
import * as constants from "../../utils/Constants";
import axios from 'axios';

import Tesseract from 'tesseract.js';

import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";


const TwoGameScreen = forwardRef((props, ref) => {

    const [windowSize, setWindowSize] = useState({
        width: window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO * (4.0 / 3.0),
        height: window.innerHeight * constants.TWO_DECORATIVE_GAME_HEIGHT_RATIO
    });

    useImperativeHandle(ref, () => ({
        // 부모 컴포넌트에서 사용할 함수를 선언
        captureImage
    }))
   

    const headers = {
        'Accept': 'application/json',
        'Authorization': constants.AUTHORIZATION_IMAGE
    };

    // 웹캡 변수
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

    // 프레임 생기는 곳 변수
    const canvasRef3 = useRef(null);
    const contextRef3 = useRef(null);

    const canvasOffSetX = useRef(null);
    const canvasOffSetY = useRef(null);

    // 캐릭터 변수
    const canvasRef4 = useRef(null);
    const contextRef4 = useRef(null);

    // 캔버스 합성 변수
    const canvasRef5 = useRef(null);
    const contextRef5 = useRef(null);

    // 마우스 드래그
    let dragok = false;
    let startX;
    let startY;
    const shapes = useRef([]); // 이모지 저장소

    // 손그리기 캔버스
    useEffect(() => {
        let radius = 20;

        switch (HandGesture.current) {
            case constants.DRAW:
                // console.log("DRAW");
                contextRef.current.fillStyle = "#"
                contextRef.current.beginPath();
                contextRef.current.moveTo(preFingerPositionX.current, preFingerPositionY.current);
                contextRef.current.lineTo(fingerPosition.x, fingerPosition.y);
                contextRef.current.stroke();
                contextRef.current.closePath();
                // webRTC
                const obj = {
                    "startX": fingerPosition.x,
                    "startY": fingerPosition.y,
                    "lastX": preFingerPositionX.current,
                    "lastY": preFingerPositionY.current,
                }
                // if (dataChannel.current != null)
                    // dataChannel.current.send(JSON.stringify(obj));

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
        if (fingerPosition.x < windowSize.width * constants.GAME_FRAME_POSITION_X_RATIO
            || fingerPosition.x > windowSize.width * constants.GAME_FRAME_WIDTH_RATIO + windowSize.width * constants.GAME_FRAME_POSITION_X_RATIO
            || fingerPosition.y < 0 || fingerPosition.y > windowSize.height * constants.GAME_FRAME_HEIGHT_RATIO) {
            preFingerPositionX.current = null;
            preFingerPositionY.current = null;
        }
    }, [fingerPosition]);

    // 단어 적는 프레임 캔버스
    useEffect(() => {
        const canvas = canvasRef3.current;
        const ctx = canvas.getContext("2d");
        canvas.width = windowSize.width;
        canvas.height = windowSize.height;

        // 프레임 변수 (단어 쓰는 곳)
        const frameImage = new Image();
        frameImage.src = frame;

        if (!canvasRef3) return;
        frameImage.onload = function () {
            ctx.drawImage(frameImage, windowSize.width * constants.GAME_FRAME_POSITION_X_RATIO, 0,
                windowSize.width * constants.GAME_FRAME_WIDTH_RATIO, windowSize.height * constants.GAME_FRAME_HEIGHT_RATIO); // 프레임 위치 나중에 손 봐야함
            console.log("width:" + frameImage.width + ", height:" + frameImage.height);
            console.log(windowSize.width + "+" + windowSize.height);
        };
    }, [canvasRef3]);

    // 이모지 생성 캔버스
    useEffect(() => {
        const canvas = canvasRef4.current;
        canvas.width = windowSize.width;
        canvas.height = windowSize.height;

        const context = canvas.getContext("2d");
        contextRef4.current = context;

        const canvasOffSet = canvas.getBoundingClientRect();
        canvasOffSetX.current = canvasOffSet.left;
        canvasOffSetY.current = canvasOffSet.top;
    }, [canvasRef4]);

    useEffect(() => {
        const canvas = canvasRef5.current;
        const ctx = canvas.getContext("2d");
        canvas.width = windowSize.width;
        canvas.height = windowSize.height;
    }, [canvasRef5]);

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
                width: windowSize.width,
                height: windowSize.height,
            });
            camera.start();
        }

        const canvas = canvasRef2.current;
        canvas.width = windowSize.width;
        canvas.height = windowSize.height;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 10;
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
            const x = calculateX(parseInt(windowSize.width - results.multiHandLandmarks[0][8].x * windowSize.width));
            const y = calculateY(parseInt(results.multiHandLandmarks[0][8].y * windowSize.height));

            HandGesture.current = detectHandGesture(results.multiHandLandmarks[0]);  //현재 그리기 모드
            setFingerPosition({ x: x, y: y });
        }
        canvasCtx.restore();
    };

    const calculateX = (beforeX) => {
        if (beforeX > windowSize.width * constants.GAME_FRAME_WIDTH_RATIO + windowSize.width * constants.GAME_FRAME_POSITION_X_RATIO
            || beforeX < windowSize.width * constants.GAME_FRAME_POSITION_X_RATIO) {
            beforeX = preFingerPositionX;
        }
        return beforeX;
    }

    const calculateY = (beforeY) => {
        if (beforeY > windowSize.height * constants.GAME_FRAME_HEIGHT_RATIO
            || beforeY < 0) {
            beforeY = preFingerPositionY;
        }
        return beforeY;
    }

    function rect(r) {
        const image = new Image();
        image.src = r.fill;
        // canvasRef4.current.getContext('2d').fillStyle = image;
        // canvasRef4.current.getContext('2d').fillRect(r.x, r.y, r.width, r.height);
        // const image = new Image();
        // image.src = r.fill;
        image.onload = function () {
            canvasRef4.current.getContext('2d').drawImage(image, r.x, r.y, r.width, r.height);
        }
    }

    function clear() {
        canvasRef4.current.getContext('2d').clearRect(0, 0, windowSize.width, windowSize.height);
    }

    function draw() {
        console.log("thisisdraw " + shapes.current.length);
        // redraw each shape in the shapes[] array
        for (let i = 0; i < shapes.current.length; i++) {
            // decide if the shape is a rect or circle
            // (it's a rect if it has a width property)
            if (shapes.current[i].width) {
                rect(shapes.current[i]);
            }
        }
        clear();
    }


    // handle mousedown events
    function myDown({ nativeEvent }) {
        // tell the browser we're handling this mouse event
        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        // get the current mouse position
        const mx = parseInt(nativeEvent.clientX - canvasOffSetX.current);
        const my = parseInt(nativeEvent.clientY - canvasOffSetY.current);

        console.log("x:" + mx + ", y:" + my);
        console.log("myDown" + dragok);
        // test each shape to see if mouse is inside
        dragok = false;
        console.log("thisisDown " + shapes.current.length);
        for (let i = 0; i < shapes.current.length; i++) {
            var s = shapes.current[i];
            console.log("xx:" + s.x + ", yy:" + s.y);
            // decide if the shape is a rect or circle
            if (s.width) {
                // test if the mouse is inside this rect
                if (
                    !dragok &&
                    mx > s.x &&
                    mx < s.x + s.width &&
                    my > s.y &&
                    my < s.y + s.height
                ) {
                    // if yes, set that rects isDragging=true
                    dragok = true;
                    s.isDragging = true;
                }
            } else {
                const dx = s.x - mx;
                const dy = s.y - my;
                // test if the mouse is inside this circle
                if (!dragok && dx * dx + dy * dy < s.r * s.r) {
                    dragok = true;
                    s.isDragging = true;
                }
            }
        }
        // save the current mouse position
        startX = mx;
        startY = my;
    }

    // handle mouseup events
    function myUp({ nativeEvent }) {
        // tell the browser we're handling this mouse event
        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        console.log("myUp" + dragok);
        // clear all the dragging flags
        dragok = false;
        for (let i = 0; i < shapes.current.length; i++) {
            shapes.current[i].isDragging = false;
        }
    }

    // handle mouse moves
    function myMove({ nativeEvent }) {
        // if we're dragging anything...
        if (dragok) {
            console.log("drag ok! - myMove");
            // tell the browser we're handling this mouse event
            nativeEvent.preventDefault();
            nativeEvent.stopPropagation();

            // get the current mouse position
            const mx = parseInt(nativeEvent.clientX - canvasOffSetX.current);
            const my = parseInt(nativeEvent.clientY - canvasOffSetY.current);

            // calculate the distance the mouse has moved
            // since the last mousemove
            const dx = mx - startX;
            const dy = my - startY;

            // move each rect that isDragging
            // by the distance the mouse has moved
            // since the last mousemove
            for (let i = 0; i < shapes.current.length; i++) {
                const s = shapes.current[i];
                if (s.isDragging) {
                    s.x += dx;
                    s.y += dy;
                }
            }

            // redraw the scene with the new rect positions
            draw();

            // reset the starting mouse position for the next mousemove
            startX = mx;
            startY = my;
        }
        else {
            console.log("drag no ok! - myMove");
        }
    }

    // 이미지 저장
    const spaceDown = (e) => {
        if (e.key === ' ') {
            console.log("space click");
            //const image = canvasRef2.current.toDataURL("image/png"); // 이걸로 바로하면 흑백 처리 안됨
            //const image = converToGray();
            const image = preprocessImage(canvasRef2.current, windowSize.width, windowSize.height);

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

        canvasRef2.current.getContext('2d').clearRect(0, 0, windowSize.width, windowSize.height); // 저장 후 지우기
    }

    // 이모지 넣어주는 함수 
    const setEmoji = (emojiName) => {
        const canvas = canvasRef4.current;
        canvas.width = windowSize.width;
        canvas.height = windowSize.height;
        const image = new Image();

        const response = axios.get(
            'https://api.flaticon.com/v3/search/icons/{orderBy}?q=' + emojiName,
            { headers }
        ).then(res => {
            console.log(res.data);
            var source = res.data.data[2].images[512];
            console.log(source);
            source = source.replace("https://cdn-icons-png.flaticon.com", "");
            image.crossOrigin = "anonymous";
            image.src = source;
        })
            .catch((Error) => console.log(Error))
        console.log(image.src);

        //image.src = "https://emojiapi.dev/api/v1/" + emojiName + "/" + parseInt(windowSize.width * constants.GAME_EMOJI_RATIO) + ".png";

        //image.crossOrigin = "Anonymous";
        //image.setAttribute('crossOrigin', '');
        //image.crossOrigin="*";
        image.onerror = function () {
            draw();
        }

        image.onload = function () {
            //ctx.drawImage(image, 125, 0);
            shapes.current.push({
                x: windowSize.width * constants.GAME_FRAME_POSITION_X_RATIO, y: 0, width: windowSize.width * constants.GAME_EMOJI_RATIO, height: windowSize.width * constants.GAME_EMOJI_RATIO,
                fill: image.src, isDragging: false
            });
            props.getData(shapes.current.length);
            props.getWord(emojiName);
            draw();
            console.log("thisissetimage " + shapes.current.length);
            console.log("success!");
        }
    }

    const captureImage = () => {
        const canvas = canvasRef5.current;
        const webcam = canvasRef.current;
        const emojiCanvas = canvasRef4.current;
        const ctx = canvas.getContext('2d')
        const ctxEmojiCanvas = emojiCanvas.getContext('2d')
        console.log("hihihihihihi???");
        // 두 캔버스를 저장용 캔버스에 그린다 (먼저 그린쪽이 아래에 있는 레이어가 된다)
        ctx.drawImage(webcam, 0, 0);
        ctx.drawImage(emojiCanvas, 0, 0);
        console.log(canvas);
        var img = new Image();
        // img.crossOrigin = "anonymous";
        img.src = canvas.toDataURL('image/png');


        // var blobBin = atob(img.src.split(',')[1]);	// base64 데이터 디코딩
        // var array = [];
        // for (var i = 0; i < blobBin.length; i++) {
        //     array.push(blobBin.charCodeAt(i));
        // }

        // var file = new Blob([new Uint8Array(array)], { type: 'image/png' });	// Blob 생성
        // const image = URL.createObjectURL(file);


        //a태그를 만들고 다운로드한뒤 갖다 버린다
        let link = document.createElement('a');
        link.download = "my_image.png";
        link.href = img.src;
        link.click();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        canvasRef5.current.getContext('2d').clearRect(0, 0, windowSize.width, windowSize.height); // 저장 후 지우기
    }

    const f1Down = (e) => {
        if (e.key === 'Enter') {
            console.log("f1 click");

            captureImage();
        }
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

        contextRef.current.beginPath();
        contextRef.current.moveTo(obj.startX, obj.startY);
        contextRef.current.lineTo(obj.lastX, obj.lastY);
        contextRef.current.stroke();
        contextRef.current.closePath();
    }
    //function8
    async function makeConnection() {
        myPeerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        // 'stun:stun.l.google.com:19302',
                        // 'stun:stun1.l.google.com:19302',
                        // 'stun:stun2.l.google.com:19302',
                        // 'stun:stun3.l.google.com:19302',
                        // 'stun:stun4.l.google.com:19302',
                        "stun:stun.l.google.com:19302",
                        'stun:stun1.l.google.com:19302',
                        'stun:stun2.l.google.com:19302',
                        'stun:stun3.l.google.com:19302',
                        'stun:stun4.l.google.com:19302',
                        'stun:stun.ekiga.net',
                        'stun:stun.ideasip.com',
                        'stun:stun.rixtelecom.se',
                        'stun:stun.schlund.de',
                        'stun:stun.stunprotocol.org:3478',
                        'stun:stun.voiparound.com',
                        'stun:stun.voipbuster.com',
                        'stun:stun.voipstunt.com',
                        'stun:stun.voxgratia.org',

                        'stun:23.21.150.121:3478',
                        'stun:iphone-stun.strato-iphone.de:3478',
                        'stun:numb.viagenie.ca:3478',
                        'stun:s1.taraba.net:3478',
                        'stun:s2.taraba.net:3478',
                        'stun:stun.12connect.com:3478',
                        'stun:stun.12voip.com:3478',
                        'stun:stun.1und1.de:3478',
                        'stun:stun.2talk.co.nz:3478',
                        'stun:stun.2talk.com:3478',
                        'stun:stun.3clogic.com:3478',
                        'stun:stun.3cx.com:3478',
                        'stun:stun.a-mm.tv:3478',
                        'stun:stun.aa.net.uk:3478',
                        'stun:stun.acrobits.cz:3478',
                        'stun:stun.actionvoip.com:3478',
                        'stun:stun.advfn.com:3478',
                        'stun:stun.aeta-audio.com:3478',
                        'stun:stun.aeta.com:3478',
                        'stun:stun.alltel.com.au:3478',
                        'stun:stun.altar.com.pl:3478',
                        'stun:stun.annatel.net:3478',
                        'stun:stun.antisip.com:3478',
                        'stun:stun.arbuz.ru:3478',
                        'stun:stun.avigora.com:3478',
                        'stun:stun.avigora.fr:3478',
                        'stun:stun.awa-shima.com:3478',
                        'stun:stun.awt.be:3478',
                        'stun:stun.b2b2c.ca:3478',
                        'stun:stun.bahnhof.net:3478',
                        'stun:stun.barracuda.com:3478',
                        'stun:stun.bluesip.net:3478',
                        'stun:stun.bmwgs.cz:3478',
                        'stun:stun.botonakis.com:3478',
                        'stun:stun.budgetphone.nl:3478',
                        'stun:stun.budgetsip.com:3478',
                        'stun:stun.cablenet-as.net:3478',
                        'stun:stun.callromania.ro:3478',
                        'stun:stun.callwithus.com:3478',
                        'stun:stun.cbsys.net:3478',
                        'stun:stun.chathelp.ru:3478',
                        'stun:stun.cheapvoip.com:3478',
                        'stun:stun.ciktel.com:3478',
                        'stun:stun.cloopen.com:3478',
                        'stun:stun.colouredlines.com.au:3478',
                        'stun:stun.comfi.com:3478',
                        'stun:stun.commpeak.com:3478',
                        'stun:stun.comtube.com:3478',
                        'stun:stun.comtube.ru:3478',
                        'stun:stun.cope.es:3478',
                        'stun:stun.counterpath.com:3478',
                        'stun:stun.counterpath.net:3478',
                        'stun:stun.cryptonit.net:3478',
                        'stun:stun.darioflaccovio.it:3478',
                        'stun:stun.datamanagement.it:3478',
                        'stun:stun.dcalling.de:3478',
                        'stun:stun.decanet.fr:3478',
                        'stun:stun.demos.ru:3478',
                        'stun:stun.develz.org:3478',
                        'stun:stun.dingaling.ca:3478',
                        'stun:stun.doublerobotics.com:3478',
                        'stun:stun.drogon.net:3478',
                        'stun:stun.duocom.es:3478',
                        'stun:stun.dus.net:3478',
                        'stun:stun.e-fon.ch:3478',
                        'stun:stun.easybell.de:3478',
                        'stun:stun.easycall.pl:3478',
                        'stun:stun.easyvoip.com:3478',
                        'stun:stun.efficace-factory.com:3478',
                        'stun:stun.einsundeins.com:3478',
                        'stun:stun.einsundeins.de:3478',
                        'stun:stun.ekiga.net:3478',
                        'stun:stun.epygi.com:3478',
                        'stun:stun.etoilediese.fr:3478',
                        'stun:stun.eyeball.com:3478',
                        'stun:stun.faktortel.com.au:3478',
                        'stun:stun.freecall.com:3478',
                        'stun:stun.freeswitch.org:3478',
                        'stun:stun.freevoipdeal.com:3478',
                        'stun:stun.fuzemeeting.com:3478',
                        'stun:stun.gmx.de:3478',
                        'stun:stun.gmx.net:3478',
                        'stun:stun.gradwell.com:3478',
                        'stun:stun.halonet.pl:3478',
                        'stun:stun.hellonanu.com:3478',
                        'stun:stun.hoiio.com:3478',
                        'stun:stun.hosteurope.de:3478',
                        'stun:stun.ideasip.com:3478',
                        'stun:stun.imesh.com:3478',
                        'stun:stun.infra.net:3478',
                        'stun:stun.internetcalls.com:3478',
                        'stun:stun.intervoip.com:3478',
                        'stun:stun.ipcomms.net:3478',
                        'stun:stun.ipfire.org:3478',
                        'stun:stun.ippi.fr:3478',
                        'stun:stun.ipshka.com:3478',
                        'stun:stun.iptel.org:3478',
                        'stun:stun.irian.at:3478',
                        'stun:stun.it1.hr:3478',
                        'stun:stun.ivao.aero:3478',
                        'stun:stun.jappix.com:3478',
                        'stun:stun.jumblo.com:3478',
                        'stun:stun.justvoip.com:3478',
                        'stun:stun.kanet.ru:3478',
                        'stun:stun.kiwilink.co.nz:3478',
                        'stun:stun.kundenserver.de:3478',
                        'stun:stun.l.google.com:19302',
                        'stun:stun.linea7.net:3478',
                        'stun:stun.linphone.org:3478',
                        'stun:stun.liveo.fr:3478',
                        'stun:stun.lowratevoip.com:3478',
                        'stun:stun.lugosoft.com:3478',
                        'stun:stun.lundimatin.fr:3478',
                        'stun:stun.magnet.ie:3478',
                        'stun:stun.manle.com:3478',
                        'stun:stun.mgn.ru:3478',
                        'stun:stun.mit.de:3478',
                        'stun:stun.mitake.com.tw:3478',
                        'stun:stun.miwifi.com:3478',
                        'stun:stun.modulus.gr:3478',
                        'stun:stun.mozcom.com:3478',
                        'stun:stun.myvoiptraffic.com:3478',
                        'stun:stun.mywatson.it:3478',
                        'stun:stun.nas.net:3478',
                        'stun:stun.neotel.co.za:3478',
                        'stun:stun.netappel.com:3478',
                        'stun:stun.netappel.fr:3478',
                        'stun:stun.netgsm.com.tr:3478',
                        'stun:stun.nfon.net:3478',
                        'stun:stun.noblogs.org:3478',
                        'stun:stun.noc.ams-ix.net:3478',
                        'stun:stun.node4.co.uk:3478',
                        'stun:stun.nonoh.net:3478',
                        'stun:stun.nottingham.ac.uk:3478',
                        'stun:stun.nova.is:3478',
                        'stun:stun.nventure.com:3478',
                        'stun:stun.on.net.mk:3478',
                        'stun:stun.ooma.com:3478',
                        'stun:stun.ooonet.ru:3478',
                        'stun:stun.oriontelekom.rs:3478',
                        'stun:stun.outland-net.de:3478',
                        'stun:stun.ozekiphone.com:3478',
                        'stun:stun.patlive.com:3478',
                        'stun:stun.personal-voip.de:3478',
                        'stun:stun.petcube.com:3478',
                        'stun:stun.phone.com:3478',
                        'stun:stun.phoneserve.com:3478',
                        'stun:stun.pjsip.org:3478',
                        'stun:stun.poivy.com:3478',
                        'stun:stun.powerpbx.org:3478',
                        'stun:stun.powervoip.com:3478',
                        'stun:stun.ppdi.com:3478',
                        'stun:stun.prizee.com:3478',
                        'stun:stun.qq.com:3478',
                        'stun:stun.qvod.com:3478',
                        'stun:stun.rackco.com:3478',
                        'stun:stun.rapidnet.de:3478',
                        'stun:stun.rb-net.com:3478',
                        'stun:stun.refint.net:3478',
                        'stun:stun.remote-learner.net:3478',
                        'stun:stun.rixtelecom.se:3478',
                        'stun:stun.rockenstein.de:3478',
                        'stun:stun.rolmail.net:3478',
                        'stun:stun.rounds.com:3478',
                        'stun:stun.rynga.com:3478',
                        'stun:stun.samsungsmartcam.com:3478',
                        'stun:stun.schlund.de:3478',
                        'stun:stun.services.mozilla.com:3478',
                        'stun:stun.sigmavoip.com:3478',
                        'stun:stun.sip.us:3478',
                        'stun:stun.sipdiscount.com:3478',
                        'stun:stun.sipgate.net:10000',
                        'stun:stun.sipgate.net:3478',
                        'stun:stun.siplogin.de:3478',
                        'stun:stun.sipnet.net:3478',
                        'stun:stun.sipnet.ru:3478',
                        'stun:stun.siportal.it:3478',
                        'stun:stun.sippeer.dk:3478',
                        'stun:stun.siptraffic.com:3478',
                        'stun:stun.skylink.ru:3478',
                        'stun:stun.sma.de:3478',
                        'stun:stun.smartvoip.com:3478',
                        'stun:stun.smsdiscount.com:3478',
                        'stun:stun.snafu.de:3478',
                        'stun:stun.softjoys.com:3478',
                        'stun:stun.solcon.nl:3478',
                        'stun:stun.solnet.ch:3478',
                        'stun:stun.sonetel.com:3478',
                        'stun:stun.sonetel.net:3478',
                        'stun:stun.sovtest.ru:3478',
                        'stun:stun.speedy.com.ar:3478',
                        'stun:stun.spokn.com:3478',
                        'stun:stun.srce.hr:3478',
                        'stun:stun.ssl7.net:3478',
                        'stun:stun.stunprotocol.org:3478',
                        'stun:stun.symform.com:3478',
                        'stun:stun.symplicity.com:3478',
                        'stun:stun.sysadminman.net:3478',
                        'stun:stun.t-online.de:3478',
                        'stun:stun.tagan.ru:3478',
                        'stun:stun.tatneft.ru:3478',
                        'stun:stun.teachercreated.com:3478',
                        'stun:stun.tel.lu:3478',
                        'stun:stun.telbo.com:3478',
                        'stun:stun.telefacil.com:3478',
                        'stun:stun.tis-dialog.ru:3478',
                        'stun:stun.tng.de:3478',
                        'stun:stun.twt.it:3478',
                        'stun:stun.u-blox.com:3478',
                        'stun:stun.ucallweconn.net:3478',
                        'stun:stun.ucsb.edu:3478',
                        'stun:stun.ucw.cz:3478',
                        'stun:stun.uls.co.za:3478',
                        'stun:stun.unseen.is:3478',
                        'stun:stun.usfamily.net:3478',
                        'stun:stun.veoh.com:3478',
                        'stun:stun.vidyo.com:3478',
                        'stun:stun.vipgroup.net:3478',
                        'stun:stun.virtual-call.com:3478',
                        'stun:stun.viva.gr:3478',
                        'stun:stun.vivox.com:3478',
                        'stun:stun.vline.com:3478',
                        'stun:stun.vo.lu:3478',
                        'stun:stun.vodafone.ro:3478',
                        'stun:stun.voicetrading.com:3478',
                        'stun:stun.voip.aebc.com:3478',
                        'stun:stun.voip.blackberry.com:3478',
                        'stun:stun.voip.eutelia.it:3478',
                        'stun:stun.voiparound.com:3478',
                        'stun:stun.voipblast.com:3478',
                        'stun:stun.voipbuster.com:3478',
                        'stun:stun.voipbusterpro.com:3478',
                        'stun:stun.voipcheap.co.uk:3478',
                        'stun:stun.voipcheap.com:3478',
                        'stun:stun.voipfibre.com:3478',
                        'stun:stun.voipgain.com:3478',
                        'stun:stun.voipgate.com:3478',
                        'stun:stun.voipinfocenter.com:3478',
                        'stun:stun.voipplanet.nl:3478',
                        'stun:stun.voippro.com:3478',
                        'stun:stun.voipraider.com:3478',
                        'stun:stun.voipstunt.com:3478',
                        'stun:stun.voipwise.com:3478',
                        'stun:stun.voipzoom.com:3478',
                        'stun:stun.vopium.com:3478',
                        'stun:stun.voxgratia.org:3478',
                        'stun:stun.voxox.com:3478',
                        'stun:stun.voys.nl:3478',
                        'stun:stun.voztele.com:3478',
                        'stun:stun.vyke.com:3478',
                        'stun:stun.webcalldirect.com:3478',
                        'stun:stun.whoi.edu:3478',
                        'stun:stun.wifirst.net:3478',
                        'stun:stun.wwdl.net:3478',
                        'stun:stun.xs4all.nl:3478',
                        'stun:stun.xtratelecom.es:3478',
                        'stun:stun.yesss.at:3478',
                        'stun:stun.zadarma.com:3478',
                        'stun:stun.zadv.com:3478',
                        'stun:stun.zoiper.com:3478',
                        'stun:stun1.faktortel.com.au:3478',
                        'stun:stun1.l.google.com:19302',
                        'stun:stun1.voiceeclipse.net:3478',
                        'stun:stun2.l.google.com:19302',
                        'stun:stun3.l.google.com:19302',
                        'stun:stun4.l.google.com:19302',
                        'stun:stunserver.org:3478',
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
        <div style={{
            position: "relative",
            height: "100%"
        }}>
            <Webcam
                className="webcam"
                audio={false}
                mirrored={true}
                ref={webcamRef}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    top: "0",
                    left: "0",
                    right: "0",
                    textAlign: "center",
                    zIndex: 9,
                    width: "100%",
                    height: "100%",
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
                    width: "100%",
                    height: "100%",
                }}>
            </canvas>
            <canvas
                className="canvas"
                ref={canvasRef2}
                mirrored={true}
                tabIndex={0}
                //onKeyDown={f1Down}
                onKeyDown={spaceDown}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: "0",
                    right: "0",
                    textAlign: "center",
                    zIndex: 9,
                    width: "100%",
                    height: "100%",
                }}>
            </canvas>

            <canvas
                ref={canvasRef3}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: "0",
                    right: "0",
                    textAlign: "center",
                    zIndex: 10,
                    width: "100%",
                    height: "100%",
                }}>
            </canvas>

            <canvas
                ref={canvasRef4}
                onMouseUp={myUp}
                onMouseMove={myMove}
                onMouseDown={myDown}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: "0",
                    right: "0",
                    textAlign: "center",
                    zIndex: 11,
                    width: "100%",
                    height: "100%",
                }}>
            </canvas>

            <canvas
                ref={canvasRef5}
                mirrored={true}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: "0",
                    right: "0",
                    textAlign: "center",
                    zIndex: 9,
                    width: "100%",
                    height: "100%",
                }}>
            </canvas>

        </div>
    )
});

export default TwoGameScreen;