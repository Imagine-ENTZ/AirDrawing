import React from "react";
import "./HowToDecorative.css";
import StarRain from "./component/StarRain.jsx";
import onoff from "./img/on-off-button.png";
import HowTo4 from "./img/howto4.png";
import LeftArrow from "./img/left-arrow.png";
import { useNavigate } from "react-router-dom";

function HowToDecorative3() {
    const navigate = useNavigate();

    const howto_sentence4 = {
        0: '4. After decorating the camera with emoticons, if you want to leave a picture,\npress ‘Click Me!’ to take a picture after 5 seconds and save it.'
    }

    return (
        <div className="main-container-how-decorative">
            <StarRain />
            <div className="top-container-how-decorative">
                <div className="top-left-container-how-decorative"></div>
                <div className="top-right-container-how-decorative">
                    <div className="on-off-button-how-decorative" onClick={() => navigate("/decorative")}>
                        <img className="on-off-image-how-decorative" src={onoff} alt="END"></img>
                    </div>
                </div>
            </div>
            <div className="body-container-how-decorative">
                <div className="left-body-container-how-decorative">
                    <img className="arrow-image-how-2-decorative" onClick={() => navigate("/decorative/howto/3")} src={LeftArrow} alt="right" />
                </div>
                <div className="center-container-how-decorative">
                    <img className="how-to-image-decorative" src={HowTo4} alt="how-to-game-4" />
                </div>
                <div className="right-body-container-how-decorative">

                </div>
            </div>
            <div className="bottom-container-how-decorative">
                <div className="howto-sentence-1-decorative">{howto_sentence4[0]}</div>
            </div>
            <div className="bottom-of-bottom-container-how-decorative">

            </div>
        </div>
    );
};

export default HowToDecorative3;