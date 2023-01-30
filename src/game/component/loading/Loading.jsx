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
            <div className="modal-wrap">
                    <SyncLoader
                        color="#FFF"
                        loading={loading}
                        cssOverride={override}
                        size={20}
                    />
            </div>
    );
};

export default Loading;