import React from "react";
import "./TwoDecorativeLobby.css";
import StarRain from "./component/StarRain.jsx";
import Direction from "./img/direction-arrow.png";
import { useNavigate } from "react-router-dom";

function TwoDecorativeLobby() {
    const navigate = useNavigate();

    return (
        <div className="main-container-two-decorative">
            {/* <StarRain /> */}
            <div className="top-container-two-decorative">

            </div>
            <div className="body-container-two-decorative">
                <div className="body-top-container-two-decorative">

                </div>
                <div className="body-middle-container-two-decorative">

                </div>
            </div>
            <div className="bottom-container-two-decorative">

            </div>
        </div>

    );
};

export default TwoDecorativeLobby;