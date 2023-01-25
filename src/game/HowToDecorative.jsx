import React from "react";
import "./HowToDecorative.css";
import StarRain from "./component/StarRain.jsx";
import Direction from "./img/direction-arrow.png";
import { useNavigate } from "react-router-dom";

function DecorativeGameLobby() {
    const navigate = useNavigate();


    return (
        <div className="main-container-how-decorative">
            <div className="top-container-how-decorative">

            </div>
            <div className="body-container-how-decorative">

            </div>
            <div className="bottom-container-how-decorative">

            </div>
        </div>
    );
};

export default DecorativeGameLobby;