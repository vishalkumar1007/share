import React, { useEffect, useRef, useState } from "react";
import "./receiveText.css";
import QrCodeScanner from "../QrCodeScanner/QrCodeScanner";
import scanImage from "../../assets/scan.png";
import { toast } from "sonner";

const ReceiveText = () => {
  const [inputCodeSection, setInputCodeSection] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [codeInputError, setCodeInputError] = useState(false);
  const [multiverseCode, setMultiverseCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const[autoFetchEnable,setAutoFetchEnable] = useState(false);

  const [userCodeOutput, setUserCodeOutput] = useState("");
  const inputRefs = useRef([]);

  const authInputCodeValid = () => {
    for (const element of multiverseCode) {
      if (element === "" || element.length !== 1 || /a-zA-Z/.test(element)) {
        toast.error(`Invalid Multiverse Code`, {
          style: {
            color: "#d92525e1",
          },
        });
        setCodeInputError(true);
        return false;
      }
    }
    setCodeInputError(false);
    return true;
  };

  const actionToFetchTextFromMultiverse = async() => {
    let multiverseArrangeCode = '';
    multiverseCode.forEach((element)=>{
      multiverseArrangeCode+=element;
    })

    
    if (!authInputCodeValid() || multiverseArrangeCode.length!==6) {
      return;
    }
    
    try {
      const universalTextApi = `http://localhost:8080/api/TextMultiverse/universalTextData?multiverseCode=${multiverseArrangeCode}`;
      const fetchDataRes = await fetch(universalTextApi,{
        method:'GET',
        headers:{
          "Content-type":"application/json"
        }
      })

      
      if (!fetchDataRes.ok) {
        if (fetchDataRes.status === 404) {
          toast.error(`Invalid Multiverse Code`, {
            style: {
              color: "#d92525e1",
            },
          });
          return;
        } else if (fetchDataRes.status === 429) {
          toast.error(`Too Many Request, port close`, {
            style: {
              color: "#d92525e1",
            },
          });
          return;
        } else if (fetchDataRes.status === 500) {
          toast.error(`Internal server error`, {
            style: {
              color: "#d92525e1",
            },
          });
          return;
        }else{
          toast.error(`Response error , check your internet`, {
            style: {
              color: "#d92525e1",
            },
          });
        }
      }
      
      const fetchJsonDataRes = await fetchDataRes.json();
      
      if (fetchDataRes.status === 200 && fetchJsonDataRes.responseStatus==='success') {
        setUserCodeOutput(fetchJsonDataRes.codeMappedText);
        setInputCodeSection(false);
        setMultiverseCode(["", "", "", "", "", ""]);
        toast.success(`Multiverse Port Found successfully 👍`, {
          style: {
            color: "#19b030d0",
          },
        });
      }else{
        toast.error(`Something went wrong`, {
          style: {
            color: "#d92525e1",
          },
        });
      } 
      
    } catch (error) {
      console.log(`Error while fetching data from server : ${error}`);
      toast.error(`Error while fetch data from server`, {
        style: {
          color: "#d92525e1",
        },
      });
    }

  };

  const copyResultText = async () => {
    if (userCodeOutput === "") {
      toast.error(`Nothing to copy form clipboard`, {
        style: {
          color: "#d92525e1",
        },
      });
    } else {
      try {
        await navigator.clipboard.writeText(userCodeOutput);
        toast.success(`multiverse text copy successfully 👍`, {
          style: {
            color: "#19b030d0",
          },
        });
      } catch (err) {
        toast.error(`Sorry , error while copy multiverse text`, {
          style: {
            color: "#d92525e1",
          },
        });
        console.log("error while copy text ", err);
      }
    }
  };

  const handelScanner = async (res) => {
    setMultiverseCode(["", "", "", "", "", ""]);
    setScannerOpen(res.action);

    const url = res.url;

    if (url.length === 0) {
      return;
    }

    const isIncludeCodeName = url.includes("multiversecode");
    const getCode = url.substring(url.indexOf("=") + 1, url.length);

    const isPureCode = !getCode.split("").some((char) => {
      return !(char.charCodeAt() >= 48 && char.charCodeAt() <= 57);
    });

    if (!isIncludeCodeName || getCode.length !== 6 || !isPureCode) {
      toast.error(`Invalid QR Code`, {
        style: {
          color: "#d92525e1",
        },
      });
      return;
    }

    const arrOfCode = [];
    for (const element of getCode) {
      arrOfCode.push(element);
    }
    setMultiverseCode(arrOfCode);
    toast.success(`QR Code Scanned Successfully`, {
      style: {
        color: "#19b030d0",
      },
    });
    setAutoFetchEnable(true);
  };

  useEffect(() => {
    const isValidMultiverseCode = 
    autoFetchEnable && multiverseCode.length === 6 &&
      multiverseCode.every(char => char >= '0' && char <= '9');
  
    if (isValidMultiverseCode) {
      setAutoFetchEnable(false);
      actionToFetchTextFromMultiverse();
    }
  }, [autoFetchEnable, multiverseCode]);
  

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
                    style={{
                      border: codeInputError ? "1px solid #ac0c0c78" : null,
                    }}
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleInputChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={() => setCodeInputError(false)}
                  />
                ))}
              </div>
            </div>
            <div className="receiveText_main_user_input_code_fetch_data_main">
              <button onClick={() => actionToFetchTextFromMultiverse()}>
                Fetch Text
              </button>
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
          </div>
        )
      ) : (
        <div className="receiveText_main_received_text_preview_box">
          <div
            className="receiveText_main_received_text_preview_box_nav_back"
            onClick={() => setInputCodeSection(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#B7B7B7"
            >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
          </div>
          <button
            id="receiveText_main_received_text_preview_box_main_box_copy_content"
            onClick={() => copyResultText()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#B7B7B7"
            >
              <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
            </svg>
          </button>
          <div className="receiveText_main_received_text_preview_box_main_box">
            {userCodeOutput}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiveText;
