import React from 'react'
import "../HomePage.css"
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import {Link} from "react-router-dom";

function MainHome() {

    return (
        <div className='MainHome'>
            <div className='MainHome_left'>
                <img className='airplneimg' src={"Image/paper-plane.png"}></img>
            </div>

            <div className='MainHome_right'>
                <div className='MainHome_right_title'>Study words while playing!!!</div>
                <div className='main_login_button'>

                    <Link to = {`/main`}>
                    <AwesomeButton
                        className='mainButton'
                        type="secondary"
                        >Login
                        
                    </AwesomeButton>
                    </Link>
                    
                </div>

                <AwesomeButton
                    className='mainButton'
                    type="primary">Register
                </AwesomeButton>


            </div>
        </div>
    )
}

export default MainHome