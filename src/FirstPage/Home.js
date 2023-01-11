import React from "react";
import "./Home.css";
import homeimage from './img/mainimagenone.png';
import line from './img/line.png';
import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();
    
    const navigateToLobby = () => {
        navigate("/lobby");
    };

    return (
        <div>
            <p id="age">For Kids</p>
            <p id="page-name">PlayGround</p>
            <button id="start_button" onClick={navigateToLobby}>Get Started</button>
            <img id="line" src={line} alt="line"/>
            <img id="home_image" src={homeimage} alt="homeimage"/>
        </div>
    );
};

export default Home;