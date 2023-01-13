import React from "react";
import "./Login.css";
import LoginContainer from "./Component/LoginContainer";
import Image from "./Component/ImageContainer";
import Snow from "./Component/SnowCopy";

function Login() {
      return (
        <div className="hero">
          <Snow />
        <div className="main-container">
           <LoginContainer />
           <Image />
        </div>
        </div>
      );
}

export default Login;
