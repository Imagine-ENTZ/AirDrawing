import React from "react";
import "../Home.css";
import homeimage from '../img/mainimagetrue.png';
import line from '../img/line.png';
import { useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();

    // 제일 처음 화면에서 어디로 갈지..
    const navigateToLoginOrSignup = () => {
        navigate("/selection");
        //navigate("/main");
    };

    return (
        <div className="main-container-main">
            <div className="left-container-main">
                <div className="age">For Kids</div>
                <div className="page-name">PlayGround</div>
                <img className="line-main" src={line} alt="line"/>
                <button className="start-button" onClick={navigateToLoginOrSignup}>Get Started</button>
            </div>
            <div className="right-container-main">
                <img className="home-image-main" src={homeimage} alt="homeimage"/>
            </div>
        </div>
    );
};

export default Main;