import React from "react";
import "./Signup.css";
import SignupContainer from './Component/SignupContainer';
import Image from './Component/ImageContainer';

function Signup() {
      return (
        <div className="main-container">
            <SignupContainer />
            <Image />
        </div>
      );
}

export default Signup;
