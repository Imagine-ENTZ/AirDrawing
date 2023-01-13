import React from "react";
import "../Signup.css";
import line from '../img/line.png';
import { useNavigate } from "react-router-dom";

function SignupContainer() {

    const navigate = useNavigate();
    
    const navigateToLoginAgain = () => {
        navigate("/login");
    };

      return (
        <div className="left-container">
        <div className="left-top-container">
            <div className="top-title">SignUp</div>
            <img className="line" src={line} alt="line"/>
        </div>
        <div className="left-body-container"> 
        <div className="input-list">
            <div className="contact-form">
                <div>
                <input className="input-class" id="Name" name="name" type="text"></input>
                <label className="label-class" for="Name">NAME</label>
                </div>
            </div>
            <div className="contact-form">
                <div>
                <input className="input-class" id="Email" name="email" type="text"></input>
                <label className="label-class" for="Email">EMAIL</label>
            </div>
            </div>
            <div className="contact-form">
                <div>
                <input className="input-class" id="Password" name="password" type="password"></input>
                <label className="label-class" for="Password">PASSWORD</label>
            </div>
            </div>
            <div className="contact-form">
                <div>
                <input className="input-class" id="Password-confirm" name="password-confirm" type="password"></input>
                <label className="label-class" for="Password-confirm">PASSWORD-CONFIRM</label>
            </div>
            </div>
            <button className="register-button" onClick={navigateToLoginAgain}>REGISTER</button>

        </div>
        </div>
    </div>
    );
}

export default SignupContainer;
