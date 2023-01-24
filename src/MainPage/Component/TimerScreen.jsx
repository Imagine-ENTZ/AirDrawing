import React, { useEffect, useState } from "react";
import "./TimerScreen.css";

function TimerScreen({ onClose }) {
    const [count, setCount] = useState(5);

    useEffect(() => {
        const id = setInterval(() => {
            setCount(count => count - 1);
        }, 1000);
        if (count === 0) {
            handleClose();
            clearInterval(id);
        }
        return () => clearInterval(id);
    }, [count]);

    // 팝업창 끄는거
    const handleClose = () => {
        onClose?.();
    };

    return (
        <div className="over-lay">
            <div className="modal-wrap">
                <div className="contents">
                    <div className="introductory-phrase">It will be filmed in 5 seconds!</div>
                    <div className="count-down">{count}</div>
                </div>
            </div>
        </div>
    );
}

export default TimerScreen;
