import React from "react";
import "./Login.css";
import LoginContainer from "./component/LoginContainer";
import Image from "./component/ImageContainer";
import Snow from "./component/SnowCopy";
import Top from "./component/TopContainer";

function Login() {
  return (
    <div className="hero">
      <Snow />
      <div className="main-container-login">
        <Top />
        <div className="body-container-login">
          <LoginContainer />
          <Image />
        </div>
      </div>
    </div>
  );
}

export default Login;
