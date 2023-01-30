import {React, useEffect} from "react";
import styled from "styled-components";
import userImage from "../../img/emotion/sunglasses.png"
import questionMark from "../../img/question_mark.png"
import "./Modal.css"

function Modal({ onClose,onClick }) {
  const handleClose = () => {
    onClose?.();
    onClick();
  };

  return (
      <Overlay>
        <ModalWrap>
          <Contents>
            <div className='word-tracing-wait-message'>
              <div>
                <div>Waiting for opponent,</div>
                <div>please wait...</div>
              </div>
            </div>

            <div className='word-tracing-user-img-container'>
              <div className='word-tracing-player-screen'>
                <div className='word-tracing-user-img-wrapper'>
                  <img className='word-tracing-user-img' src={userImage} alt="smile" />
                </div>
                <div className='word-tracing-user-name'>ming-taro</div>
              </div>
              <div className='word-tracing-player-versus-screen'>
                vs
              </div>
              <div className='word-tracing-player-screen'>
                <div className='word-tracing-user-img-wrapper'>
                  <img className='word-tracing-user-img' src={questionMark} alt="smile" />
                </div>
                <div className='word-tracing-user-name'>?</div>
              </div>
            </div>

            <Button onClick={handleClose}>exit</Button>
          </Contents>
        </ModalWrap>
      </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 9999;
`;

const ModalWrap = styled.div`
  width: 600px;
  height: fit-content;
  border-radius: 15px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CloseButton = styled.div`
  float: right;
  width: 40px;
  height: 40px;
  margin: 20px;
  cursor: pointer;
  i {
    color: #5d5d5d;
    font-size: 30px;
  }
`;

const Contents = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const Button = styled.button`
  font-size: 14px;
  padding: 10px 20px;
  margin-bottom: 20px;
  border: none;
  background-color: #ababab;
  border-radius: 10px;
  color: white;
  font-style: italic;
  font-weight: 200;
  cursor: pointer;
  font-family: Silkscreen;
  &:hover {
    background-color: #898989;
  }
`;
export default Modal;