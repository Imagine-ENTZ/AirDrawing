<h1 align="center">
  <a href="https://github.com/Imagine-ENTZ/AirDrawing" title="AwesomeCV Documentation">
    <img alt="AwesomeCV" src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/e1be76c5-3bf5-478a-8bc4-c790ef10f3a2" width="100%" height="100%" />
  </a>
  <br />
    ENTZ P.A.S
</h1>
<p align="center">
   손동작 인식을 통한 어린이 영어교육 화상 웹게임 플랫폼입니다.
  
</p>

<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white"/>


  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=flat&logo=javascript&logoColor=white"/>

  
<img src="https://img.shields.io/badge/Tesseract-006600?style=flat&logo=logoColor=white"/>

<img src="https://img.shields.io/badge/Mediapipe-1299F3?style=flat&logo=logoColor=white"/>

  <img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=flat&logo=springboot&logoColor=white"/>

<img src="https://img.shields.io/badge/STOMP-6DB33F?style=flat&logo=logoColor=white"/>

<img src="https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socketdotio&logoColor=white"/>

<img src="https://img.shields.io/badge/WebRTC-333333?style=flat&logo=webrtc&logoColor=white"/>
  



 <img src="https://img.shields.io/badge/Microsoft Azure-0078D4?style=flat&logo=microsoftazure&logoColor=white"/>

<img src="https://img.shields.io/badge/Azure WebApp-527FFF?style=flat&logo=microsoftazure&logoColor=white"/>

<img src="https://img.shields.io/badge/SQL Database-527FFF?style=flat&logo=microsoftazure&logoColor=white"/>

<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white"/>


</div>



## 📹 소개 영상
- [https://www.youtube.com/watch?v=syoiIqvgm44](https://www.youtube.com/watch?v=syoiIqvgm44)


## 📌 개요
- 프로젝트 이름 :손동작 인식을 통한 어린이 영어교육 웹 플랫폼
- 참여 공모전 : 2023 Microsoft Imagine Cup Competition
- 개발 배경 : 성인 뿐만 아니라 글을 읽고 쓸 줄 모르는 어린이도 많아 문맹 문제가 심각하다는 사실을 알게 되었습니다. 하루종일 휴대폰을 하는 아이들에게 어떻게 하면 흥미를 가지며 영어공부를 할 수 있을지 고민하다 손동작을 인식해 영어공부를 할 수 있는 프로젝트를 만들고자 하였습니다.
- 배포 주소 : https://thankful-field-06f913500.2.azurestaticapps.net/
- 개발 언어 : JavaScript, Java
- 프론트 : React, Tesseract, Mediapipe, WebCam, Canvas, OpenCV
- 백엔드 : Spring Boot, Spring STOMP, WebRTC, Spring JPA, Azure 가상머신, Azure 웹 앱, Azure SQL DB

## 🕰️ 개발 기간
- 2023.01.04 ~ 2023.01.28

## 👬 팀 소개
- 홍영환 - <a href="https://github.com/Imagine-ENTZ/Server">백엔드 (Spring Boot)</a>, Azure API 서버 구축 및 배포, WebRTC, Spring STOMP, <a href="https://github.com/Imagine-ENTZ/AirDrawing">프론트 (React)</a>, WebSocket 연결, Canvas그림그리기, Tesseract 문자 변환, 1 vs 1 화상게임 구현, 손모양 인식 모델 적용, WORD-TRACING 구현
- 박민지 - <a href="https://github.com/Imagine-ENTZ/AirDrawing">프론트 (React)</a> , 게임 타이머, DECORATIVE GAME 전체 구현
- 김영림 - <a href="https://github.com/Imagine-ENTZ/AirDrawing">프론트 (React)</a> WORD-TRACING 구현, 메인 배경 및 게임 배경, 이미지 캡쳐

## 🖥️ 프로젝트 소개

### 1. 🖐️ 손 동작 인식
- Mediapipe에서 제공하는 손 동작 인식 모델을 사용하였습니다(versoin 0.3.1629416409)
- 손가락의 지점 3차원 좌표를 벡터계산을 통해서 다양한 손모양 수신호를 만들었습니다.

<div align="center">

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/091a1c65-7887-4698-8dae-dad117b6ea51" height="200" width="100%" >|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/0defb593-b499-4065-8143-4a83538c2f64" height="200" width="100%"> |
|:---:|:---:|
|실제 손모양 인식|손동작 모델|

</div>

<hr>

### 2. ✏️ 그림그리기
- React Canvas를 이용하여 사용자의 웹캠화면에 그림을 그릴 수 있도록 하였습니다.
- 손 모양에 따라서 그리기, 지우기, 초기화 등 그림그리기 기본 기능을 이용할 수 있도록 하였습니다.
<div align="center">

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/ebbd8951-33b6-45c1-9c76-7f84f8d10874" height="200" width="100%" >|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/98b38baa-312f-4777-94a2-eec5f9367e0d" height="200" width="100%"> |
|:---:|:---:|
|손모양에 따른 그리기 기능|벡터 계산|

<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/bd06c5c1-cc74-4786-b315-1fcdebbdabe7" width="90%">
<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/5462609c-7c7a-459b-a2b7-be828387f293" width="90%">

</div>



<hr>

### 3. 📄 글자인식
- Canvas에 cat이란 단어를쓰면 Tesseract를 이용하여 cat을 문자로 인식할 수 있도록 하였습니다.
- 전처리(기울기, 매끄럽게 다듬기) 등을 통해서 인식률을 높였습니다.

<div align="center">
<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/a6c5c53e-450d-4e9a-a859-72c17c5beefa" width="100%" height="100%">
</div>


## ⚙️ 프로젝트 주요 기능

Game Mode 종류
1. 단어 따라쓰기 ( WORD TRACING )
2. 나의 화면 꾸미기 ( DECORATING )

Game Player
1. 나홀로 게임
2. 1 vs 1 매치 게임

<div align="center">

<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/d44c77dc-f7d4-419f-bb43-89332203bd3d" width="100%" >

</div>

<hr>

## 1.  🎮 단어 따라쓰기 ( WORD TRACING )

<div align="center">

<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/b39b6ced-acc0-40cf-8ed7-fa7752eb65ae" width="100%" >

<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/fb8f9b1b-e0d1-4730-8fa7-b386e3b21282">

</div>

- 랜덤으로 제시된 단어를 따라서 작성한 후 "OK" 손동작을 취하면 정답이 맞는지 확인해 줍니다.
- 정답을 맞추면 Score가 100점씩 증가합니다.
## 2.  🎮 나의 화면 꾸미기 ( DECORATING )

<div align="center">

<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/052d846b-7f58-420d-b080-5157d6ddbea7" width="100%" >

</div>

<hr>


##  💾 시스템 설계도
<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/59c46ea5-5656-40c6-b63b-9558914a41ae" height="100%" width="100%" >



<p align="center">
    <img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/7cb49ab8-3f3c-4b2e-bd1e-fd1e35fdd187"/>
    
<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/fb8f9b1b-e0d1-4730-8fa7-b386e3b21282">
    
</p>