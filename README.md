<h1 align="center">
  <a href="https://github.com/Imagine-ENTZ/AirDrawing" title="AwesomeCV Documentation">
    <!-- <img alt="AwesomeCV" src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/e1be76c5-3bf5-478a-8bc4-c790ef10f3a2" width="100%" height="100%" /> -->

<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/7cb49ab8-3f3c-4b2e-bd1e-fd1e35fdd187"/>

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
- 홍영환 - <a href="https://github.com/Imagine-ENTZ/Server">백엔드 (Spring Boot)</a>, Azure API 서버 구축 및 배포, WebRTC, Spring STOMP, STUN TURN 서버 구축 <a href="https://github.com/Imagine-ENTZ/AirDrawing">프론트 (React)</a>, WebSocket 연결, Canvas그림그리기, Tesseract 문자 변환, 1 vs 1 화상게임 구현, 손모양 인식 모델 적용, WORD-TRACING 구현
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

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/ff8ac359-a89d-4f0f-84cd-159b3eaf3419"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/71a22d26-d404-4d0c-9122-bcfff934ab37"  width="100%" >|
|:---:|:---:|
|손 모양에 따른 기능| 각 지점 벡터|



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

- 랜덤으로 제시된 단어를 따라서 작성합니다.
- "OK" 손동작(엄지 척)을 취하면 정답이 맞는지 확인해 줍니다.
- 정답을 맞추면 Score가 100점씩 증가합니다.

## 2.  🎮 나의 화면 꾸미기 ( DECORATING )

<div align="center">

<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/052d846b-7f58-420d-b080-5157d6ddbea7" width="100%" >

</div>

- 게임방법

<div align="center">

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/3c60b7d5-5949-4522-8d82-2ccd85d5241e"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/1a2800e9-af3d-4feb-a68b-4a62a08de101"  width="100%" >|
|:---:|:---:|
|게임 방법1| 게임 방법2| 

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/c1aeb492-d95b-4d69-8c0e-5ea8c2c9bbd0"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/5a1ac0ee-3a6c-4b4a-9679-ba15a04b3d56"  width="100%" >|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/0906ab63-cf9a-4c87-95a8-26fdcd4df53e"  width="100%"> |
|:---:|:---:|:---:|
|게임 방법3 | 게임 방법4 |게임 방법5|

</div>

<hr>

- 예시
<div align="center">

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/fb7c0810-c933-426f-ab83-68743bfc770d"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/a473501c-9839-4f8e-9c0c-0c9a43b71e90"  width="100%" >|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/047e3bac-2eaf-4dd6-ae96-3d3def6a2138"  width="100%"> |
|:---:|:---:|:---:|
|단어 작성| 아이콘 생성| 아이콘 이동|

</div>

- 원하는 단어를 작성합니다.
- 스페이스바( Space bar )를 누르면 아이콘 생성 API에 요청해 해당 단어의 아이콘이 랜덤으로 화면에 나옵니다.
- 마우스 커서를 이용해 아이콘을 움직이며 웹화면을 꾸밀 수 있습니다.
- 아이콘을 배치하고 화면을 이미지로 다운로드할 수 있습니다.

##  🆚 1 vs 1 대결모드

<div align="center">

<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/78c8ba24-cc28-4c4b-ac98-bbfffff1a218" height="100%" width="100%" >

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/9d7ee26e-c9e9-424f-ab64-4a9853beca1c"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/f58b179c-a620-4121-bf44-e065b11116ca"  width="100%" >|
|:---:|:---:|
|방 생성| 상대방 입장 대기 |

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/86d7f8d4-9f30-4339-9df2-a390d11a9443"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/323f2170-0cbe-49b1-8e42-0b37304444fc"  width="100%" >|
|:---:|:---:|
|대결 시작| 대결 중 |
</div>

< 단어 따라쓰기 ( WORD TRACING ) >
- 플레이 하고자 하는 게임의 모드를 선택 후 방을 생성합니다.
- 상대방이 입장을 하게 되면 게임이 시작하게 됩니다.
- 제시된 단어를 작성하여 OK모션( 엄지 척 )으로 제출합니다.
- 제한시간동안 Score가 높은 사람이 승리합니다.

< 나의 화면 꾸미기 ( DECORATING ) >
- 입장 후 각자 화면에 원하는 아이콘의 단어를 작성합니다.
- 스페이스바를 눌러 문자를 아이콘으로 전환합니다.
- 원하는 위치에 아이콘을 위치시킨 후 프로필을 꾸밉니다.

<hr>

##  💾 시스템 설계도
<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/59c46ea5-5656-40c6-b63b-9558914a41ae" height="100%" width="100%" >

<hr>

## 🛠️ 아쉽거나 어려웠던점
- 2인용 게임에서 나의 화면 꾸미기 ( DECORATING )로 플레이하면 한 화면에 두 사람이 서로 글씨를 작성해 프로필을 같이 꾸미는 기능 구현까지 성공했었다. 하지만 상대방이 그린 점들의 좌표를 실시간으로 계속 공유하고 캔버스에 동시에 그려주는 기능에 있어서 좌표가 조금 부정확하게 그려지는 부분이 있어 제출전에 다시 개인의 프로필을 꾸미는 방법으로 진행했었다. 개발시간이 더 있었다면 [공유 프로필 꾸미기] 기능도 추가해보고 싶다.

- 로컬에서 WebRTC는 따로 STUN TURN서버가 필요없지만 배포를하고 외부에서 서로 1대1 대결을 하려면 서버가 꼭 필요했었다.
인터넷에 찾아보니 구글이나 다른 곳에서 무료로 지원해주는 STUN/TURN 서버들이 이전에는 있었지만 현재는 전부 막혔다는 사실을 접했다.
그래서 부랴부랴 외국 유튜버의 기술블로그를 보며 Azure 서버를 하나 더 생성해 마감시간안에 완성할 수 있었다.

## 📌 페이지 화면

### 1. 메인페이지
<p align="center">

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/7cb49ab8-3f3c-4b2e-bd1e-fd1e35fdd187"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/fd6a0e59-dfe6-4843-aac2-8977370dc8f4"  width="100%" >|
|:---:|:---:|
|메인| Get Started|

</p>

### 2. 로그인, 회원가입

<p align="center">

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/a89dbad0-89bb-47ee-a3cd-29e710812b58"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/12a4668d-55f1-40cd-9f0b-10e5ddb404f0"  width="100%" >|
|:---:|:---:|
|로그인| 회원가입 |

</p>

### 3. 게임 모드 선택

<p align="center">

<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/efa002a2-3ee5-4a30-918b-0acf16b7f469"  width="100%">

</p>

### 4. 단어 따라쓰기 ( WORD TRACING )

<p align="center">

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/0de61e3e-13bd-486a-ac5a-c20e7e8021a3"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/5d01ea55-5fdf-4324-9563-6c4d7c4bdd6a"  width="100%" >|
|:---:|:---:|
| 입장 화면| 따라쓰기 |

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/c7ec8648-d51c-46ca-a0bf-d32447a03a5f"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/62d32eef-964a-4cb0-b6a5-2829ac0917d0"  width="100%" >|
|:---:|:---:|
|엄지로 정답확인| 오답 화면 |

</p>

### 5. 나의 화면 꾸미기 ( DECORATING )

<p align="center">

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/d302d32f-d463-4776-b090-7dd831bfdb7a"  width="100%"> |
|:---:|
|입장 화면|

<div align="center">

|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/fb7c0810-c933-426f-ab83-68743bfc770d"  width="100%"> |<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/a473501c-9839-4f8e-9c0c-0c9a43b71e90"  width="100%" >|<img src="https://github.com/stock-price-calculator/tradingbot/assets/77156858/047e3bac-2eaf-4dd6-ae96-3d3def6a2138"  width="100%"> |
|:---:|:---:|:---:|
|단어 작성| 아이콘 생성| 아이콘 이동|

</div>

</p>