import React from "react";
import "../Login.css";
import homeimage from '../img/mainimagetrue.png';

function ImageContainer() {

    return (
        <div className="right-container">
                <img className="home-image" src={homeimage} alt="homeimage"/>
            </div>
    );
};

export default ImageContainer;