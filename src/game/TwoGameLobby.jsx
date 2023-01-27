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
import Select from "react-select";
import { AiTwotoneCheckCircle, AiTwotoneCloseCircle} from "react-icons/ai";

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

function TwoGameLobby() {

    const navigate = useNavigate();
    // 방리스트 변수
    const [inputData, setInputData] = useState([{
        code: 0,
        name: '',
        type: '',
        full: '',
    }])
    //모달창 변수
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // 방생성 방이름
    const [modalTitle, setModalTitle] = useState("");

    const gameType = [
        { value: "1", label: "WordTracing" },
        { value: "2", label: "DecorateGame" },
    ]
    // 방생성 방타입
    const [selectType, setSelectType] = useState(gameType[0]);

    // 모달 열고 닫기
    function openModal() {
        setModalIsOpen(true);
    }
    function closeModal() {
        setModalIsOpen(false);
    }
    const handleInputTitle = (e) => {
        setModalTitle(e.target.value)
    }
    // 방만들기 완료 버튼
    const makeRoomButton = () => {
        axios.post(constants.GAMEROOM_URL,
            {
                name: modalTitle,
                type: selectType.value,
                full: 0,
            })
            .then((res) => {

                if (res.data.result == "FAIL") {
                    console.log("방 등록 실패");
                }
                else {
                    // 이제 2명 게임 방으로 이동
                    // 영림게임 

                    if (res.data["room"].type == constants.DECORATIVE_GAME) {
                        navigate(`/2p-decorative/game/${res.data["room"].code}`, {
                            state: {
                                code: res.data["room"].code,
                                sender: res.data["room"].code + 1,
                            }
                        });
                    }
                    else {
                        navigate(`/2p-word-tracing/play/${res.data["room"].code}`, {
                            state: {
                                code: res.data["room"].code,
                                sender: res.data["room"].code + 1,
                            }
                        });
                    }
                }
            })
            .catch((Error) => { console.log("에러", Error) })
    }
    // 방리스트에서 방 클릭시 방상태 변경
    const changeFullState = (code) => {
        axios.get(constants.GAMEROOM_URL + `/change/${code}`)
            .then((res) => {
                if (res.data.result == "SUCCESS") {
                    console.log("방 상태 변경 성공");
                }
                else {
                    console.log("방 상태 변경 실패");
                }
            })
            .catch((Error) => { console.log("에러", Error) })
    }

    // 생성된 방 리스트 클릭
    const selectRoomButton = (index) => {

        console.log(index);
        console.log(inputData[index].code);
        console.log(inputData[index].type);

        // 입장가능할때만 입장
        if (inputData[index].full == constants.ROOM_POSSIBLE) {
            //민지 게임으로 이동
            if (inputData[index].type == constants.WORDTRACING_GAME) {
                navigate(`/2p-word-tracing/play/${inputData[index].code}`, {
                    state: {
                        code: inputData[index].code,
                        sender: inputData[index].code + 2,
                    }
                });
            }
            //영림이 게임으로 이동
            else {
                navigate(`/2p-decorative/game/${inputData[index].code}`, {
                    state: {
                        code: inputData[index].code,
                        sender: inputData[index].code + 2,
                    }
                });
            }
            changeFullState(inputData[index].code);
        }
        else {
            // 입장 불가
            console.log("입장이 불가능한 방입니다");
            console.log("현재 방 상태 :" +inputData[index].full );
        }

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
                        full: data.full,
                    })
                    )

                    setInputData(inputData.concat(_inputData));
                }
                else {
                    console.log("게임방 리스트 불러오기 실패");
                }
            })
            .catch((Error) => { console.log("에러", Error) })
    }, [])


    return (
        <div className="hero">
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
                                            <div key={index} onClick={() => { selectRoomButton(index) }} className="selection_roomlist">
                                                <div className="selection_roomlist_inner">
                                                    <div> {item.full == constants.ROOM_POSSIBLE ?<AiTwotoneCheckCircle size="30" color="green"/> : <AiTwotoneCloseCircle size="30" color="red"/> } </div>
                                                    <div className="selection_roomlist_name"> {item.name}</div>
                                                    <div className="selection_roomlist_type">Game Type : {item.type == 1 ? "WordTracing" : "DecorateGame"}</div>
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
                                        <div onClick={closeModal} className="making-back-button">BACK</div>
                                    </div>

                                    <div className="modal_input-list">
                                        <div className="contact-form">
                                            <div>
                                                <input onChange={handleInputTitle} className="input-class" id="Name" name="name" type="text"></input>
                                                <label className="label-class" for="Name">ROOM NAME</label>
                                            </div>
                                        </div>
                                        <div className="contact-form">
                                            <div className="modal-select-inner">
                                                <Select className="modal-select" options={gameType} onChange={setSelectType} defaultValue={gameType[0]}></Select>
                                            </div>
                                        </div>
                                        <button onClick={makeRoomButton} className="login-button make_room_start_button" >GET STARTED</button>
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
        </div>
    );
};

export default TwoGameLobby;