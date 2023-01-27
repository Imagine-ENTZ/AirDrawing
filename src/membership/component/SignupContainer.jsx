import React, { useState } from "react";
import "../Signup.css";
import line from '../img/line.png';
import Direction from '../img/direction-arrow.png';
import { useNavigate } from "react-router-dom";
import * as constants from "../../utils/Constants"
import axios from 'axios';

function SignupContainer() {

    const navigate = useNavigate();

    const navigateToLoginAgain = () => {

       
        // console.log(values.name , values.email, values.password, values.repassword)
        if (values.password === values.repassword && values.email!=null && values.name !=null && values.password!=null ) {
            axios.post(constants.REGISTER_URL,
                {
                    user: values.email, //id
                    name : values.name, //user name
                    password: values.password, //password
                })
                .then((Response) => {

                    if (Response.data.result == "FAIL") {
                        console.log("중복되는 ID가 있습니다");
                        setValues({
                            ...values,
                            ["email"]:"",
                        })
                    }
                    else {
                        navigate("/login");
                    }
                })
                .catch((Error) => { console.log("에러", Error) })
        }
        else {
            console.log("입력하신 패스워드가 다릅니다");
        }

    };

    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        repassword: ""
    })


    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        })
    }


    return (
        <div className="left-container-signup">
            <div className="left-top-container-signup">
                <div className="sign-up-frame">
                    <div className="top-title-signup">SignUp</div>
                    <img className="line-signup" src={line} alt="line" />
                </div>
            </div>
            <div className="left-body-container-signup">
                <div className="input-list-signup">
                    <div className="contact-form">
                        <div>
                            <input value={values.name} onChange={handleChange} className="input-class" id="Name" name="name" type="text"></input>
                            <label className="label-class" for="Name">NAME</label>
                        </div>
                    </div>
                    <div className="contact-form">
                        <div>
                            <input value={values.email} onChange={handleChange} className="input-class" id="Email" name="email" type="text"></input>
                            <label className="label-class" for="Email">EMAIL</label>
                        </div>
                    </div>
                    <div className="contact-form">
                        <div>
                            <input value={values.password} onChange={handleChange} className="input-class" id="Password" name="password" type="password"></input>
                            <label className="label-class" for="Password">PASSWORD</label>
                        </div>
                    </div>
                    <div className="contact-form">
                        <div>
                            <input value={values.repassword} onChange={handleChange} className="input-class" id="Password-confirm" name="repassword" type="password"></input>
                            <label className="label-class" for="Password-confirm">PASSWORD-CONFIRM</label>
                        </div>
                    </div>
                    <button className="register-button" onClick={navigateToLoginAgain}>REGISTER</button>

                </div>
            </div>
        </div>
    );
}

export default SignupContainer;
