import React from "react";
import "./Lobby.css";
import Snow from "./component/Snow.jsx";
import Menu from "./component/Menu.jsx";
import axios from 'axios';
import { useEffect } from "react";
import * as constants from "../utils/Constants";
function Lobby() {

	return (
		<div className="hero">
			<Snow />
			<Menu />
		</div>
	);
};

export default Lobby;