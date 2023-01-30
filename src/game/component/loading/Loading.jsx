import React from "react";
import { SyncLoader } from "react-spinners";
import "./Loading.css"

const override = {
    position: "relative",
    margin: "auto",
    borderColor: "#FFF",
    textAlign: "center",
    // background: "red"
};

const Loading = ({ loading }) => {

    return (
        <div className="over-lay" loading={loading}>
            <div className="modal-wrap">
                <div className="contents">
                    <SyncLoader
                        color="#FFF"
                        loading={loading}
                        cssOverride={override}
                        size={20}
                    />
                </div>
            </div>
        </div>
    );
};

export default Loading;