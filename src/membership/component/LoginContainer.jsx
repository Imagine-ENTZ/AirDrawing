import React, {  useState } from "react";
import "../Login.css";
import line from '../img/line.png';

import { useNavigate } from "react-router-dom";
import axios from 'axios';
import * as constants from "../../utils/Constants"

function LoginContainer() {

    const navigate = useNavigate();

    const navigateToLobby = () => {
        // axios.post(constants.LOGIN_URL,
        //     {
        //         user: id,
        //         password: password,
        //     })
        //     .then((Response) => {

        //         if (Response.data.result == "FAIL") {
        //             console.log("존재하지 않는 ID이거나 비밀번호가 틀렸습니다.");
        //             setId("");
        //             setPassword("");
        //         }
        //         else {
        //             navigate("/lobby");
        //         }
        //     })
        //     .catch((Error) => { console.log("에러", Error) })
        navigate("/lobby");
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
        <div className="left-container-login">
            <div className="left-top-container-login">
                <div className="top-title-login">Login</div>
                <img className="line-login" src={line} alt="line" />
            </div>
            <div className="left-body-container-login">
                <div className="input-list-login">
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