import React from "react";
import QRCode from "react-qr-code";

// NOTE: Encryption should be handled on the backend.
// Call your backend API to get encrypted values for QR codes.

function QrCodeGen() {
  let value = "http://localhost:5173/checkin";

  return (
    <div className="pt-100px mt-50">
      <div
        style={{
          height: "auto",
          margin: "0 auto",
          maxWidth: 64,
          width: "100%",
        }}
      >
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
