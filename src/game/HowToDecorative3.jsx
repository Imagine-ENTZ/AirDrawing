import React from "react";
import "./HowToDecorative.css";
import StarRain from "./component/StarRain.jsx";
import Direction from "./img/direction-arrow.png";
import HowTo3 from "./img/howto3.png";
import RightArrow from "./img/right-arrow.png";
import LeftArrow from "./img/left-arrow.png";
import { useNavigate } from "react-router-dom";

function HowToDecorative3() {
    const navigate = useNavigate();

    const howto_sentence3 = {
        0: '3. If the program matches the recognized word with the emoji, the emoji appears on the screen.\nA mouse can be used to change the position of the generated emoji.'
    }

    return (
        <div className="main-container-how-decorative">
            <StarRain />
            <div className="top-container-how-decorative">

            </div>
            <div className="body-container-how-decorative">
                <div className="left-body-container-how-decorative">
                    <img className="arrow-image-how-2-decorative" onClick={() => navigate("/decorative/howto/2")} src={LeftArrow} alt="right" />
                </div>
                <div className="center-container-how-decorative">
                    <img className="how-to-image-decorative" src={HowTo3} alt="how-to-game-3" />
                </div>
                <div className="right-body-container-how-decorative">
                    <img className="arrow-image-how-1-decorative" onClick={() => navigate("/decorative/howto/4")} src={RightArrow} alt="right" />
                </div>
            </div>
            <div className="bottom-container-how-decorative">
                <div className="howto-sentence-1-decorative">{howto_sentence3[0]}</div>
            </div>
            <div className="bottom-of-bottom-container-how-decorative">

            </div>
        </div>
    );
};

export default HowToDecorative3;