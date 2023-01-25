import React from "react";
import "./Signup.css";
import SignupContainer from './component/SignupContainer';
import Image from './component/ImageContainer';
import Snow from './component/SnowCopy';

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
