

import MediapipeHands from "./component/MediapipeHands.jsx"
import "./MainPage.css"

import React, { useRef, useState, useEffect } from 'react';


function MainPage() {

  const [isTrue, setIsTure] = useState(false);

  const [values, setValues] = useState({
    roomid: "",
    sender: "",
  })


  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })

  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log("전송했다" + values.email);
    setIsTure(true);
  }

  const arr = ["방이름1", "방이름2", "방이름3"];

  return (
    <div className='mainpage'>


      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="roomid"
          value={values.roomid}
          onChange={handleChange}
        />
         <input
          type="text"
          name="sender"
          value={values.sender}
          onChange={handleChange}
        />
        <button type="submit">로그인</button>
      </form>



      {/* <div className="main">
        <div className="button-list">
          <div className="selection button1">FOLLOW-UP</div>
          <div className="selection button2" >WORD-TRACING GAME</div>
          {arr.map((item) => {
            return (
              <div className="selection button1">{item}</div>
            );
          })};
        </div>
      </div> */}

      {isTrue ?  <MediapipeHands roomid={values.roomid}  sender ={values.sender} /> : null}
      {/* <MediapipeHands roomid={35}  sender ={"asdf"} />  */}



    </div>

  )
}

export default MainPage