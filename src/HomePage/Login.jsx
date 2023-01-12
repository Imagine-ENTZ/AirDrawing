import React from "react";
import "./Login.css";
import LoginContainer from "./Component/LoginContainer";
import Image from "./Component/ImageContainer";

function Login() {
      return (
        <div className="main-container">
           <LoginContainer />
           <Image />
        </div>
      );
}

export default Login;
