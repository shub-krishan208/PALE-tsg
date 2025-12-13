import React from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import crypto from 'crypto';

require('dotenv').config();


const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.ENCRYPT_KEY, 'hex');




function encrypt(text) {
  // Generate a random 16-byte (128-bit) IV for each encryption
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Combine IV and encrypted content with a separator
  return `${iv.toString('base64')}:${encrypted}`;
}



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
