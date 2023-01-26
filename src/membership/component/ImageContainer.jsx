import React from "react";
import "./ImageContainer.css";
import homeimage from '../img/mainimagetrue.png';

function ImageContainer() {

    return (
        <div className="right-container-top">
                <img className="home-image-top" src={homeimage} alt="homeimage"/>
            </div>
    );
};

export default ImageContainer;