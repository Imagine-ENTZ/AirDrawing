import React from "react";
import "./Selection.css";
import Snow from "./Component/Snow.jsx";
import SelectionMenu from "./Component/SelectionMenu.jsx";
import Waves from "./waves.jsx";

function Selection() {
    return (
		<div className="hero">
			<Snow/>
			<SelectionMenu/>
		</div>
    );
};

export default Selection;