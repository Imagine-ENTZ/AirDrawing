import React from "react";
import "./TopContainer.css";
import direction from "../img/direction-arrow.png";
import { useNavigate } from "react-router-dom";

function ImageContainer() {

    const navigate = useNavigate();

    return (
        <div className="top-container-top">
            <div className="direction-frame-top" onClick={() => navigate("/selection")}>
                <img className="direction-image-top" src={direction} alt="direct" />
            </div>
        </div>
    );
};

export default ImageContainer;