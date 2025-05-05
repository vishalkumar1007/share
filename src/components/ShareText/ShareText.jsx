import { useRef, useState } from "react";
import "./ShareText.css";
import { toast } from "sonner";
import QRCode from "react-qr-code";

const ShareText = ({ actionDoMagic }) => {
  const [openText, setOpenTex] = useState(true);
  const [userInputData, setUserInputData] = useState("");
  const userInputRef = useRef();
  const [shareTextUrl, setShareTextUrl] = useState("Something went wrong , try again after some time");
  const [multiverseCode, setMultiverseCode] = useState("Error Code");
  const [isLoading, setIsLoading] = useState(false);

  const userInputTextAuth = () => {
    if (userInputData === "") {
      toast.error(`Input should not be empty`, {
        style: {
          color: "#d92525e1",
        },
      });
      userInputRef.current.focus();
      return false;
    }
    return true;
  };

  const apiRequestForSaveData = async () => {
    try {
      const api = "http://localhost:8080/api/TextMultiverse/universalTextSave";
      const resData = await fetch(api, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ textData: userInputData }),
      });

      if (!resData.ok) {
        if (resData.status === 429) {
          toast.error(`Too many request`, {
            style: {
              color: "#d92525e1",
            },
          });
          return false;
        } else if (resData.status === 500) {
          toast.error(`Internal Server Error`, {
            style: {
              color: "#d92525e1",
            },
          });
          return false;
        } else {
          toast.error(`Response error , check your internet`, {
            style: {
              color: "#d92525e1",
            },
          });
          return false;
        }
      }

      const resJsonData = await resData.json();

      if (resData.status === 200 && resJsonData.responseStatus === "success") {
        const codeUrl = `https://vishalkumar1007.github.io/share?multiversecode=${resJsonData.code}`;
        setShareTextUrl(codeUrl);
        setMultiverseCode(resJsonData.code);
        return true;
      } else {
        toast.error(`Something went wrong`, {
          style: {
            color: "#d92525e1",
          },
        });
        return false;
      }
    } catch (error) {
      console.log(`Error while sending data to server : ${error}`);
      toast.error(`Error while sending data to server`, {
        style: {
          color: "#d92525e1",
        },
      });
      return false;
    }
  };

  const actionDoMagicFun = async () => {
    const isInputValid = userInputTextAuth();
    if (!isInputValid) {
      return;
    }
    actionDoMagic(false);
    setTimeout(() => {
        setOpenTex(false);
    }, 4500);
    actionDoMagic(true);

    setIsLoading(true);
    const apiStatus = await apiRequestForSaveData();
    setIsLoading(false);
    if (!apiStatus) {
      return;
    }


    setUserInputData("");
  };

  const copyToClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`multiverse url copy successfully 👍`, {
        style: {
          color: "#19b030d0",
        },
      });
    } catch (err) {
      toast.error(`Sorry , error while copy multiverse url`, {
        style: {
          color: "#d92525e1",
        },
      });
      console.log("error while copy text ", err);
    }
  };

  return (
    <div className="ShareText_main">
      {openText ? (
        <div className="ShareText_main_input_text">
          <div className="EnjoyText_main_top_bottom_text_send_p1">
            <p>Share Your Text Here</p>
          </div>
          <div className="EnjoyText_main_top_bottom_text_send_p2">
            <textarea
              ref={userInputRef}
              className="enjoy_text_input_box"
              id=""
              onChange={(e) => setUserInputData(e.target.value)}
              placeholder="Don't worry Doctor Strange will help you to share your text in multiverse ..."
            ></textarea>
          </div>
          <div className="enjoy_text_button_do_magic">
            <div className="enjoy_text_button_do_magic_bg_video"></div>
            <div className="enjoy_text_button_do_magic_button">
              <button
                className="enjoy_text_open_portal_btn"
                onClick={() => actionDoMagicFun()}
              >
                Open Portal
              </button>
            </div>
          </div>
        </div>
      ) : isLoading ? <div className="lds-ripple"><div></div><div></div></div> : (
        <div className="ShareText_main_preview_op_text">
          <div
            className="ShareText_main_preview_op_text_back_btn"
            onClick={() => setOpenTex(true)}
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
          <div className="EnjoyText_main_top_bottom_text_receive_title">
            <p>
              Don't worry, we will take care of your laziness. You have three
              options - pick whichever you're comfortable with.
            </p>
          </div>
          <div className="EnjoyText_main_top_bottom_text_receive_title_qr_box_main">
            <div className="EnjoyText_main_top_bottom_text_receive_title_qr_box">
              {/* <img src={qrCodeDemoImage} alt="" /> */}
              <QRCode className="qr_code_image" value={shareTextUrl} />
            </div>
          </div>
          <div className="EnjoyText_main_top_bottom_text_receive_code_preview">
            <p>{multiverseCode}</p>
          </div>
          <div className="EnjoyText_main_top_bottom_text_receive_title_url_cpy_main_box">
            <div className="EnjoyText_main_top_bottom_text_receive_title_url_cpy">
              <span className="EnjoyText_main_top_bottom_text_receive_title_url_cpy_url">
                {shareTextUrl}
              </span>
              <span
                className="EnjoyText_main_top_bottom_text_receive_title_url_cpy_clipboard"
                onClick={() => copyToClipBoard(shareTextUrl)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#967171"
                >
                  <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareText;
