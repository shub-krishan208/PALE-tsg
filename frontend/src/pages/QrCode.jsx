import React from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";



function QrCodeGen() {

    let value = "Hey buddy who are you"

    return (
        <div className="pt-100px mt-50">
            <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={value}
                    viewBox={`0 0 256 256`}
                />
            </div>
        </div>
    );
}

export default QrCodeGen;
