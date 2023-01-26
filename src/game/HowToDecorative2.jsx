import React from "react";
import "./HowToDecorative.css";
import StarRain from "./component/StarRain.jsx";
import howto2 from "./img/howto2.png";
import RightArrow from "./img/right-arrow.png";
import LeftArrow from "./img/left-arrow.png";
import { useNavigate } from "react-router-dom";

function HowToDecorative2() {
    const navigate = useNavigate();

    const howto_sentence2 = {
        0: '3. Please write the words in the black square box on the screen.\nPress the space bar when you are finished writing.\nThe program will then recognize the words you wrote.'
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
                    <img className="how-to-image-decorative" src={howto2} alt="how-to-game-3" />
                </div>
                <div className="right-body-container-how-decorative">
                    <img className="arrow-image-how-1-decorative" onClick={() => navigate("/decorative/howto/4")} src={RightArrow} alt="right" />
                </div>
            </div>
            <div className="bottom-container-how-decorative">
                <div className="howto-sentence-1-decorative">{howto_sentence2[0]}</div>
            </div>
            <div className="bottom-of-bottom-container-how-decorative">

            </div>
        </div>
    );
};

export default HowToDecorative2;