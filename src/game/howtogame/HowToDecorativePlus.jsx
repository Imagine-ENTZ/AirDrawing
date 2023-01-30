import React from "react";
import "./HowToDecorative.css";
import StarRain from "../component/effect/StarRain.jsx";
import howtoplus from "../img/howtoplus.png";
import RightArrow from "../img/right-arrow.png";
import LeftArrow from "../img/left-arrow.png";
import { useNavigate } from "react-router-dom";

function HowToDecorativePlus() {
    const navigate = useNavigate();

    const howto_sentence_plus = {
        0: '2. Please refer to the picture above for instructions on how to write and erase words!\nYou can use your index finger to write and erase it.'
    }

    return (
        <div className="main-container-how-decorative">
            <StarRain />
            <div className="top-container-how-decorative">

            </div>
            <div className="body-container-how-decorative">
                <div className="left-body-container-how-decorative">
                    <img className="arrow-image-how-2-decorative" onClick={() => navigate("/decorative/howto")} src={LeftArrow} alt="right" />
                </div>
                <div className="center-container-how-decorative">
                    <img className="how-to-image-decorative" src={howtoplus} alt="how-to-game-2" />
                </div>
                <div className="right-body-container-how-decorative">
                    <img className="arrow-image-how-1-decorative" onClick={() => navigate("/decorative/howto/3")} src={RightArrow} alt="right" />
                </div>
            </div>
            <div className="bottom-container-how-decorative">
                <div className="howto-sentence-1-decorative">{howto_sentence_plus[0]}</div>
            </div>
            <div className="bottom-of-bottom-container-how-decorative">

            </div>
        </div>
    );
};

export default HowToDecorativePlus;