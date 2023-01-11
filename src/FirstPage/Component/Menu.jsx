import React from "react";
import "../Lobby.css";
import { useNavigate } from "react-router-dom";

function Menu() {
    const sentence = {
        0: 'Choose\nGame\nAnd\nJoin it!'
    }

	const navigate = useNavigate();
    
    const navigateToLogin = () => {
        navigate("/login");
    };

    return (
        <div>
            <div class="safety"><span>Welcome, </span><span id="name">ENSHARP</span></div>
            <p class="sentence">{sentence[0]}</p>
            <div class="button-list">
                <button class="selection button1" onClick={navigateToLogin}>Follow-up</button>
                <button class="selection button2">Follow-up</button>
                <button class="selection button3">Follow-up</button>
                <button class="selection button4">Follow-up</button>
            </div>
        </div>
    );
};

export default Menu;