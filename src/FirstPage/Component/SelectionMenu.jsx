import React from "react";
import "../Selection.css";
import line from '../img/line.png';
import { useNavigate } from "react-router-dom";

function SelectionMenu() {
    const navigate = useNavigate();
    
    const navigateToLoginVer2 = () => {
        navigate("/login");
    };
    const navigateToSignupVer2 = () => {
        navigate("/signup");
    };

    const sentenceone = {
        0: 'Study\nWords\nWhile\nPlaying!'
    }

    return (
        <div className="main-container-selection">
            <div className="high-container-selection">
            <div className="left-container-selection">
                <div className="left-container-selection-top">
                    <div className="banner-age">For Kids</div>
                    <div className="banner-name">PlayGround</div>
                    <img className="line-banner" src={line} alt="line"/>
                </div>

                <div className="left-container-selection-middle">
                    <div className="selection-sentence">{sentenceone[0]}</div>
                </div>
            </div>
            <div className="right-container-selection">
                <div className="selection-button-list">
                    <button onClick={navigateToLoginVer2} className="two-selection buttons1">LOGIN</button>
                    <button onClick={navigateToSignupVer2} className="two-selection buttons2">SIGN-UP</button>
                </div>
            </div>
            </div>

            <div className="bottom-container-selection">
                <div>
                <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g class="parallax">
                    <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                    <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                    <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                    <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
                </g>
                </svg>
                </div>
            </div>
        </div>
    );
};

export default SelectionMenu;

/*
<div className="left-container-selection">
                <div className="left-container-selection-top">
                    <div className="banner-age">For Kids</div>
                    <div className="banner-name">PlayGround</div>
                    <img className="line-banner" src={line} alt="line"/>
                </div>

                <div className="left-container-selection-middle">
                    <div className="selection-sentence">{sentenceone[0]}</div>
                </div>
            </div>
            <div className="right-container-selection">
                <div className="selection-button-list">
                    <button onClick={navigateToLoginVer2} className="two-selection buttons1">LOGIN</button>
                    <button onClick={navigateToSignupVer2} className="two-selection buttons2">SIGN-UP</button>
                </div>
            </div>
            */