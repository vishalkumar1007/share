import React, { useRef, useState } from "react";
import "./receiveText.css";
import QrCodeScanner from "../QrCodeScanner/QrCodeScanner";
import scanImage from "../../assets/scan.png";
import { toast } from "sonner";

const ReceiveText = () => {
  const [inputCodeSection, setInputCodeSection] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [qrCodeScanUrl, setQrCodeScanUrl] = useState("");
  const [multiverseCode, setMultiverseCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handelScanner = (res) => {
    setMultiverseCode(["", "", "", "", "", ""]);
    // console.log('sc res : ',res)
    setQrCodeScanUrl(res.url);
    setScannerOpen(res.action);

    const url = res.url;
    const isIncludeCodeName = url.includes('multiversecode')
    const getCode = url.substring((url.indexOf('=')+1),url.length);

    const isPureCode = !getCode.split('').some(char => {
      return !(char.charCodeAt() >= 48 && char.charCodeAt() <= 57);
    });

    console.log(isPureCode);
    // console.log(isIncludeCodeName)
    // console.log(getCode.length===6)
    // console.log(isCodeHaveChar)

    if((!isIncludeCodeName)||(getCode.length!==6)||(!isPureCode)){
      toast.error(`Invalid QR Code`, {
        style: {
          color: "#d92525e1",
        },
      });
      return;
    }

    const arrOfCode = []
    for (const element of getCode) {
      arrOfCode.push(element);
    }
    setMultiverseCode(arrOfCode);
    toast.success(`QR Code Scanned Successfully`, {
      style: {
        color: "#19b030d0",
      },
    });
  };



  const handleInputChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...multiverseCode];
      newOtp[index] = value;
      setMultiverseCode(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (multiverseCode[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      }
      const newOtp = [...multiverseCode];
      newOtp[index] = "";
      setMultiverseCode(newOtp);
    }
  };

  return (
    <div className="receiveText_main">
      {inputCodeSection ? (
        scannerOpen ? (
          <div className="receiveText_main_user_input_code_open_scanner">
            <QrCodeScanner openScanner={(res) => handelScanner(res)} />
          </div>
        ) : (
          <div className="receiveText_main_user_input_code">
            <div className="receiveText_main_user_input_code_title_main">
              <p>Have Multiverse Code ?</p>
            </div>
            <div className="receiveText_main_user_input_code_scan_main">
              <div style={{ display: "flex", gap: "5px" }}>
                {multiverseCode.map((digit, index) => (
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
              <button
                className="receiveText_main_user_input_code_main_qr_scanner_btn"
                onClick={() => setScannerOpen(true)}
              >
                <img src={scanImage} alt="" />
              </button>
            </div>
            <p id="test_text">{qrCodeScanUrl}</p>
          </div>
        )
      ) : (
        <div className="receiveText_main_received_text_preview"></div>
      )}
    </div>
  );
};

export default ReceiveText;
