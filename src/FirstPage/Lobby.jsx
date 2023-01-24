import React from "react";
import "./Lobby.css";
import Snow from "./component/Snow.jsx";
import Menu from "./component/Menu.jsx";

function Lobby() {
    return (
		<div className="hero">
			<Snow/>
			<Menu/>
		</div>
    );
};

export default Lobby;