import React, { useEffect, useState } from "react";
import "./TwoGameLobby.css";
import Snow from "./component/Snow.jsx";
import { useNavigate } from "react-router-dom";
import Direction from "./img/direction-arrow.png";
import SimpleBarReact from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';
import axios from 'axios';
import * as constants from "../utils/Constants"
import { type } from "@testing-library/user-event/dist/type";


function Menu() {
    const navigate = useNavigate();

    const arr = ["방이름1", "방이름2", "방이름3", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a"];

    const [inputData, setInputData] = useState([{
        code: 0,
        name: '',
        type: '',
    }])

    useEffect(() => {

        axios.get(constants.GAMEROOM_URL)
            .then((res) => {

                // 게임방 리스트를 받아오는게 성공할때
                if (res.data.result == "SUCCESS") {
                    const _inputData = res.data["room"].map((data) => ({
                        code: data.code,
                        name: data.name,
                        type: data.type,
                    })
                    )
                    // res.data["room"].map((data) => {
                    //    console.log(data.code);
                    // })
                    // console.log(res.data["room"][0]["code"]);
                    setInputData(inputData.concat(_inputData));
                }
                else {
                    console.log("게임방 리스트 불러오기 실패");
                }
                console.log(inputData);
            })
            .catch((Error) => { console.log("에러", Error) })
    }, [])


    return (
        <div className="main-container-two-lobby">
            <Snow />
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

                        <SimpleBarReact className="simplebar">
                            {inputData.map((item, index) => {

                                if (index != 0) {
                                    return (

                                        <div className="selection_roomlist">
                                            <div className="selection_roomlist_inner">
                                                <div className="selection_roomlist_name">{item.name}</div>
                                                <div className="selection_roomlist_type">{item.type}</div>
                                            </div>
                                        </div>
                                    );
                                }
                            })};
                        </SimpleBarReact>


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

export default Menu;