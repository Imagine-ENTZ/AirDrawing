import React from "react";
import "./Lobby.css";
import Snow from "./component/Snow.jsx";
import Menu from "./component/Menu.jsx";
import axios from 'axios';
import { useEffect } from "react";
import * as constants from "../utils/Constants";
function Lobby() {


	// useEffect(()=> {

	// 	updateToken();
	// },[])

	// useEffect(() => {
	// 	const id = setInterval(() => {
	// 		updateToken();
	// 	}, 1000 *5);
	// 	return () => clearInterval(id);
	// });

	// useInterval(() => {
	// 	updateToken();

	// }, 1000 * 59 * 60);

	// const updateToken = async () => {
	// 	const date = await parseInt(new Date() / 1000)
	// 	await axios.post(constants.TOKEN_URL + `/${date}`)
	// 		.then((res) => {
	// 			console.log("토큰 발급 ", res.data);
	// 		})
	// 		.catch((Error) => { console.log("에러", Error) })
	// }

	return (
		<div className="hero">
			<Snow />
			<Menu />
		</div>
	);
};

export default Lobby;