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
import Modal from 'react-modal';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'black',
        borderRadius: "20px",
        width: "450px",
        height: "300px"
    },
};


function Menu() {
    const navigate = useNavigate();

    // 방리스트 변수
    const [inputData, setInputData] = useState([{
        code: 0,
        name: '',
        type: '',
    }])

    //모달창 변수
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [content, setContent] = useState({
        name: "",
        gametype: 0,
    });

    const [modalTitle, setModalTitle] = useState("");

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }
    const handleInputTitle = (e) => {
        setModalTitle(e.target.value)
    }


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
                                                <div className="selection_roomlist_name"> {item.name}</div>
                                                <div className="selection_roomlist_type">Game Type : {item.type}</div>
                                            </div>
                                        </div>
                                    );
                                }
                            })};
                        </SimpleBarReact>

                        <Modal
                            // className="make_room_modal"
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            style={customStyles}
                        >
                            <div className="make_room_modal">
                                <div className="make_room_top">
                                    <h2>Please enter room name!</h2>
                                    <div  className="making-back-button">BACK</div>
                                </div>

                                <div className="modal_input-list">
                                    <div className="contact-form">
                                        <div>
                                            <input className="input-class" id="Name" name="name" type="text"></input>
                                            <label className="label-class" for="Name">ROOM NAME</label>
                                        </div>
                                    </div>
                                    <div className="contact-form">
                                        <div>
                                            <input className="input-class" id="Password" name="password" type="password"></input>
                                            <label className="label-class" for="Password">PASSWORD</label>
                                        </div>
                                    </div>
                                    <button className="login-button make_room_start_button" >GET STARTED</button>
                                </div>


                                <div>
                                    <div onClick={console.log("sf")} className="selection button1">FOLLOW-UP</div>
                                </div>

                            </div>

                        </Modal>


                    </div>
                    <div className="center-bottom-container-two-lobby">

                    </div>
                </div>
                <div className="right-container-two-lobby">
                    <div className="right-top-container-two-lobby">
                        <div onClick={openModal} className="making-button">Make Room</div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Menu;