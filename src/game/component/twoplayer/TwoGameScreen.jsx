import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import "../MediapipeHands.jsx"
import { detectHandGesture } from "../HandGesture";
import { preprocessImage } from "../PreprocessImage";
import frame from "./frame.png";
import * as constants from "../../../utils/Constants"
import axios from 'axios';

import Tesseract from 'tesseract.js';

import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { createBrowserHistory } from "history";


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

    // 상대방 그림 나오는 캔버스
    const othercanvasRef = useRef(null);
    const othercontextRef = useRef(null);

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
                    "startX": preFingerPositionX.current ,
                    "startY": preFingerPositionY.current,
                    "lastX": fingerPosition.x,
                    "lastY": fingerPosition.y,
                }
                if (dataChannel.current != null)
                    dataChannel.current.send(JSON.stringify(obj));
                break;
            case constants.ERASE:
                console.log("ERASE");
                contextRef.current.save();
                contextRef.current.beginPath();
                contextRef.current.arc(fingerPosition.x, fingerPosition.y, radius, 0, 2 * Math.PI, true);
                contextRef.current.clip();
                contextRef.current.clearRect(fingerPosition.x - radius, fingerPosition.y - radius, radius * 2, radius * 2);
                contextRef.current.restore();
                const object = {
                    "startX": preFingerPositionX.current,
                    "startY": preFingerPositionY.current,
                    "lastX": fingerPosition.x,
                    "lastY": fingerPosition.y,
                }
                if (dataChannel.current != null)
                    dataChannel.current.send(JSON.stringify(object));
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

    // 상대방 그리는 캔버스
    useEffect(() => {
        const canvas = props.otherDrawingRef.current;
        const context = canvas.getContext("2d");
        canvas.width = windowSize.width;
        canvas.height = windowSize.height;

        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 10;
        props.otherContextRef.current = context;
        console.log("otherDrawingRef");

    }, [props.otherDrawingRef]);

    useEffect(() => {
        const canvas = props.otherEmojiRef.current;
        const context = canvas.getContext("2d");
        canvas.width = windowSize.width;
        canvas.height = windowSize.height;
    }, [props.otherEmojiRef]);

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
            props.getWord("Try Again");
        }

        image.onload = function () {
            //ctx.drawImage(image, 125, 0);
            shapes.current.push({
                x: windowSize.width * constants.GAME_FRAME_POSITION_X_RATIO, y: 0, width: windowSize.width * constants.GAME_EMOJI_RATIO, height: windowSize.width * constants.GAME_EMOJI_RATIO,
                fill: image.src, isDragging: false
            });
            props.getData(shapes.current.length);
            props.getWord(emojiName);

            // 영상에 보낼 것들
            const object = {
                "image": image.src,
                "number": shapes.current.length,
                "word": emojiName
            }
            if (dataChannel.current != null)
                dataChannel.current.send(JSON.stringify(object));

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
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        canvasRef5.current.getContext('2d').clearRect(0, 0, windowSize.width, windowSize.height); // 저장 후 지우기
    }

    /////////////////////////////////////////////////////////



    const videoRef = useRef(null);
    // const anotherVideoRef = useRef(null);
    const client = useRef({});

    let stream;
    let myPeerConnection;


    const dataChannel = useRef();

    // 뒤로가기 감지 변수
    const history = createBrowserHistory();

    useEffect(() => {
        // 뒤로가기 새로고침 눌렸을때 
        return history.listen((location) => {
            if (history.action === constants.EXIT) {
                client.current.activate();
            }
        })
    }, [history])


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
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
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
    //function7 그림 받은 값
    function makeOtherDrawing(event) {
        // if (props.othercontextRef){
        console.log("받은 문자의 내용 : " + event.data);
        const obj = JSON.parse(event.data);

            if(obj.startX <= 0 || obj.startY <=0 || obj.lastX <=0 || obj.lastY <= 0){
                console.log("오류발생오류발생")
                return;
            }

            let radius = 20;

            switch (HandGesture.current) {

                case constants.DRAW:
                    // console.log("DRAW");
                    console.log("hello?");
                    props.otherDrawingRef.current.getContext('2d').fillStyle = "#"
                    props.otherDrawingRef.current.getContext('2d').beginPath();
                    props.otherDrawingRef.current.getContext('2d').moveTo(obj.startX, obj.startY);
                    props.otherDrawingRef.current.getContext('2d').lineTo(obj.lastX, obj.lastY);
                    props.otherDrawingRef.current.getContext('2d').stroke();
                    props.otherDrawingRef.current.getContext('2d').closePath();
                    break;
            
                case constants.ERASE:
                    console.log("hiihihihihi??");
                    //console.log("ERASE");
                    props.otherDrawingRef.current.getContext('2d').save();
                    props.otherDrawingRef.current.getContext('2d').beginPath();
                    props.otherDrawingRef.current.getContext('2d').arc(obj.lastX, obj.lastY, radius, 0, 2 * Math.PI, true);
                    props.otherDrawingRef.current.getContext('2d').clip();
                    props.otherDrawingRef.current.getContext('2d').clearRect(obj.lastX- radius, obj.lastY - radius, radius * 2, radius * 2);
                    props.otherDrawingRef.current.getContext('2d').restore();
                    break;
            }

            props.otherEmojiRef.current.getContext('2d')
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.src = obj.image;
            image.onload = function () {
                draw();
            }

            // props.otherDrawingRef.current.getContext('2d').fillStyle = "#"
            // props.otherDrawingRef.current.getContext('2d').beginPath();
            // props.otherDrawingRef.current.getContext('2d').moveTo(obj.startX, obj.startY);
            // props.otherDrawingRef.current.getContext('2d').lineTo(obj.lastX, obj.lastY);
            // props.otherDrawingRef.current.getContext('2d').stroke();
            // props.otherDrawingRef.current.getContext('2d').closePath();
        // }
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