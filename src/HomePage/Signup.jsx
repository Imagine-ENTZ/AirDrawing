import React from "react";
import "./Signup.css";
import SignupContainer from './Component/SignupContainer';
import Image from './Component/ImageContainer';
import Snow from './Component/SnowCopy';

function Signup() {
      return (
        <div className="hero">
          <Snow />
        <div className="main-container">
            <SignupContainer />
            <Image />
        </div>
        </div>
      );
}

export default Signup;
