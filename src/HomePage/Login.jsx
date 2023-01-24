import React from "react";
import "./Login.css";
import LoginContainer from "./component/LoginContainer";
import Image from "./component/ImageContainer";
import Snow from "./component/SnowCopy";

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
