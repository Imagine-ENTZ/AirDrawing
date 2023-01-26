import React from "react";
import "./Signup.css";
import SignupContainer from './component/SignupContainer';
import Image from './component/ImageContainer';
import Snow from './component/SnowCopy';
import Top from './component/TopContainer';

function Signup() {
  return (
    <div className="hero">
      <Snow />
      <div className="main-container-signup">
        <Top />
        <div className="body-container-signup">
        <SignupContainer />
        <Image />
        </div>
      </div>
    </div>
  );
}

export default Signup;
