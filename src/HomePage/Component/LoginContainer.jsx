import React from "react";
import "../Login.css";
import line from '../img/line.png';
import { useNavigate } from "react-router-dom";

function LoginContainer() {

    const navigate = useNavigate();
    
    const navigateToLobby = () => {
        navigate("/lobby");
    };

    return (
        <div className="left-container">
        <div className="left-top-container-login">
            <div className="top-title-login">Login</div>
            <img className="line-login" src={line} alt="line"/>
        </div>
        <div className="left-body-container-login"> 
        <div className="input-list">
            <div className="contact-form">
                <div>
                <input className="input-class" id="Name" name="name" type="text"></input>
                <label className="label-class" for="Name">EMAIL</label>
                </div>
            </div>
            <div className="contact-form">
                <div>
                <input className="input-class" id="Password" name="password" type="password"></input>
                <label className="label-class" for="Password">PASSWORD</label>
            </div>
            </div>
            <button className="register-button" onClick={navigateToLobby}>Get Started</button>
        </div>
        </div>
    </div>
    );
};

export default LoginContainer;