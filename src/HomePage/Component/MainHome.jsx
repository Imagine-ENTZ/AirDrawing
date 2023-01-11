import React from 'react'
import "../HomePage.css"
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';

function MainHome() {
    return (
        <div className='MainHome'>
            <div className='MainHome_left'>
                <img className='airplneimg' src={"Image/paper-plane.png"}></img>
            </div>

            <div className='MainHome_right'>
                <div className='MainHome_right_title'>Study various words while playing!!!</div>
                <AwesomeButton
                    className='mainButton'
                    type="secondary">Login</AwesomeButton>

                <AwesomeButton
                    className='mainButton'
                    type="secondary">Register</AwesomeButton>


            </div>
        </div>
    )
}

export default MainHome