import React from "react";
import "../TwoGameLobby.css";
import { useNavigate } from "react-router-dom";
import Direction from "../img/direction-arrow.png";


function TwoGameLobbyContainer() {
    const navigate = useNavigate();

    return (
        <div className="main-container-two-lobby">
            <div className="top-container-two-lobby">
                <div className="direction-frame-two-lobby" onClick={() => navigate("/lobby")}>
                    <img className="direction-image-two-lobby" src={Direction} alt="direct" />
                </div>
            </div>
            <div className="body-container-two-lobby">
                <div className="left-container-two-lobby">
                </div>
                <div className="center-container-two-lobby">
                    <div className="center-top-container-two-lobby">
                        <div className="choose-sentence">
                            Choose The Room You Want!
                        </div>
                    </div>
                    <div className="center-ofcenter-container-two-lobby">
                        {/* 이 곳에 방 리스트가 들어갑니다 */}
                    </div>
                    <div className="center-bottom-container-two-lobby">

                    </div>
                </div>
                <div className="right-container-two-lobby">
                    <div className="right-top-container-two-lobby">
                        <div className="making-button">Make Room</div>
                    </div>
                    <div className="right-body-container-two-lobby">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoGameLobbyContainer;