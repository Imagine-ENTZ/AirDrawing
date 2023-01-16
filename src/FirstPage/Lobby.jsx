import React from "react";
import "./Lobby.css";
import Snow from "./Component/Snow.jsx";
import Menu from "./Component/Menu.jsx";

function Lobby() {
    return (
		<div className="hero">
			<Snow/>
			<Menu/>
		</div>
    );
};

export default Lobby;