import React, { useRef, useState } from "react";
import "./receiveText.css";
import QrCodeScanner from "../QrCodeScanner/QrCodeScanner";
import scanImage from '../../assets/scan.png'

const ReceiveText = () => {
  const [inputCodeSection, setInputCodeSection] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handelScanner =(res)=>{
    console.log('sc res : ',res)
    setScannerOpen(res.action)
  }

  const handleInputChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  return (
    <div className="receiveText_main">
      {inputCodeSection ? (
        scannerOpen ? (
          <div className="receiveText_main_user_input_code_open_scanner">
            <QrCodeScanner openScanner = {(res)=>handelScanner(res)}/>
          </div>
        ) : (
          <div className="receiveText_main_user_input_code">
            <div className="receiveText_main_user_input_code_title_main">
              <p>Have Multiverse Code ?</p>
            </div>
            <div className="receiveText_main_user_input_code_scan_main">
              <div style={{ display: "flex", gap: "5px" }}>
                {otp.map((digit, index) => (
                  <input
                    className="receiveText_main_user_input_code_scan_main_span"
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleInputChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
            </div>
            <div className="receiveText_main_user_input_code_fetch_data_main">
              <button>Fetch Text</button>
            </div>
            <div className="receiveText_main_user_input_code_or_option">
              <span className="or_option_span_line"></span>
              <span className="or_option_span_text">Or</span>
              <span className="or_option_span_line"></span>
            </div>
            <div className="receiveText_main_user_input_code_main">
              <button className="receiveText_main_user_input_code_main_qr_scanner_btn" onClick={()=>setScannerOpen(true)}>
                <img src={scanImage} alt="" />
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="receiveText_main_received_text_preview"></div>
      )}
    </div>
  );
};

export default ReceiveText;
