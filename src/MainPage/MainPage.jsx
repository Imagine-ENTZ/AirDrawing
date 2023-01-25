import MediapipeHands from "./Component/MediapipeHands.jsx"
import "./MainPage.css"

import React, { useRef, useState, useEffect } from 'react';


function MainPage() {

  const [isTrue, setIsTure] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
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

  return (
    <div className='mainpage'>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        <button type="submit">로그인</button>
      </form>

      {isTrue ?  <MediapipeHands roomid={123}  sender ={values.email} /> : null}
     

    </div>

  )
}

export default MainPage