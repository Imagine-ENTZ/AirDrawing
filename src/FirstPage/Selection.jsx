import React from "react";
import "./Selection.css";
import Snow from "./component/Snow.jsx";
import SelectionMenu from "./component/SelectionMenu.jsx";

function Selection() {
    return (
		<div className="hero">
			<Snow/>
			<SelectionMenu/>
		</div>
    );
};

export default Selection;