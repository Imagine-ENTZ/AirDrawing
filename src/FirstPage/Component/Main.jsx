import React from "react";
import "../Home.css";
import homeimage from '../img/mainimagenone.png';
import line from '../img/line.png';
import { useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();
    
    const navigateToLoginOrSignup = () => {
        navigate("/login-or-signup");
    };

    return (
        <div>
            <p id="age">For Kids</p>
            <p id="page-name">PlayGround</p>
            <button id="start_button" onClick={navigateToLoginOrSignup}>Get Started</button>
            <img id="line" src={line} alt="line"/>
            <img id="home_image" src={homeimage} alt="homeimage"/>
        </div>
    );
};

export default Main;