import React from "react";
import "./HowToDecorative.css";
import StarRain from "../component/effect/StarRain.jsx";
import direction from "../img/direction-arrow.png";
import howto1 from "../img/howto1.png";
import rightarrow from "../img/right-arrow.png";
import { useNavigate } from "react-router-dom";

function HowToDecorative() {
    const navigate = useNavigate();

    const howto_sentence = {
        0: '1. Please check if you can see yourself on the screen.\nIt may take some time for the screen to appear!'
    }

    return (
        <div className="main-container-how-decorative">
            <StarRain />
            <div className="top-container-how-decorative">
                <div className="direction-frame-how-decorative" onClick={() => navigate("/decorative")}>
                    <img className="direction-image-how-decorative" src={direction} alt="direct" />
                </div>
            </div>
            <div className="body-container-how-decorative">
                <div className="left-body-container-how-decorative">

                </div>
                <div className="center-container-how-decorative">
                    <img className="how-to-image-decorative" src={howto1} alt="how-to-game-1" />
                </div>
                <div className="right-body-container-how-decorative">
                    <img className="arrow-image-how-1-decorative" onClick={() => navigate("/decorative/howto/2")} src={rightarrow} alt="right" />
                </div>
            </div>
            <div className="bottom-container-how-decorative">
                <div className="howto-sentence-1-decorative">{howto_sentence[0]}</div>
            </div>
            <div className="bottom-of-bottom-container-how-decorative">

            </div>
        </div>
    );
};

export default HowToDecorative;