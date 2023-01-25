import React, { useRef, useEffect, useState } from "react";
import "../Login.css";
import line from '../img/line.png';
import Direction from "../img/direction-arrow.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function LoginContainer() {

    const navigate = useNavigate();

    const navigateToLobby = () => {
        console.log(id);
        console.log(password)

        axios.post(`http://localhost:8080/member/login`,
            {
               
                    user: id,
                    password: password,
                 
              
                // withCredentials: true,
            })
            .then((Response) => {

                if (Response.data.result == "FAIL") {
                    console.log("존재하지 않는 ID이거나 비밀번호가 틀렸습니다.");
                    console.log(Response.data)
                    setId("");
                    setPassword("");
                }
                else {
                    navigate("/lobby");
                }


            })
            .catch((Error) => { console.log("에러", Error) })

    };

    const [id, setId] = useState();
    const [password, setPassword] = useState();

    const handleInputId = (e) => {
        setId(e.target.value);
    }
    const handleInputPassword = (e) => {
        setPassword(e.target.value);
    }


    return (
        <div className="left-container">
            <div className="left-topoftop-container-login">
                <div className="direction-frame-login" onClick={() => navigate("/selection")}>
                    <img className="direction-image-login" src={Direction} alt="direct" />
                </div>
            </div>
            <div className="left-top-container-login">
                <div className="top-title-login">Login</div>
                <img className="line-login" src={line} alt="line" />
            </div>
            <div className="left-body-container-login">
                <div className="input-list">
                    <div className="contact-form">
                        <div>
                            <input onChange={handleInputId} className="input-class" id="Name" name="name" type="text"></input>
                            <label className="label-class" for="Name">EMAIL</label>
                        </div>
                    </div>
                    <div className="contact-form">
                        <div>
                            <input onChange={handleInputPassword} className="input-class" id="Password" name="password" type="password"></input>
                            <label className="label-class" for="Password">PASSWORD</label>
                        </div>
                    </div>
                    <button className="login-button" onClick={navigateToLobby}>GET STARTED</button>
                </div>
            </div>
        </div>
    );
};

export default LoginContainer;