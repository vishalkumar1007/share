import { useState } from "react";
import "./ShareText.css";
import { toast } from "sonner";
import qrCodeDemoImage from '../../assets/QR_code.svg'
import QRCode from "react-qr-code";

const ShareText = ({ actionDoMagic }) => {
  const[openText,setOpenTex] = useState(true);
  const [shareTextUrl , setShareTextUrl] = useState('https://vishalkumar1007.github.io/share?multiversecode=332121')

  const actionDoMagicFun = () => {
    setTimeout(()=>{
      setOpenTex(false)
    },4800 )
    actionDoMagic(true);
  };

  const copyToClipBoard = async (text)=>{
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
      console.log('error while copy text ', err);
    }
  } 

  return (
    <div className="ShareText_main">
      {openText? (
        <div className="ShareText_main_input_text">
          <div className="EnjoyText_main_top_bottom_text_send_p1">
            <p>Share Your Text Here</p>
          </div>
          <div className="EnjoyText_main_top_bottom_text_send_p2">
            <textarea
              className="enjoy_text_input_box"
              id=""
              placeholder="Don't worry Doctor Strange will help you to share your text in multiverse ..."
            ></textarea>
          </div>
          <div className="enjoy_text_button_do_magic">
            <div className="enjoy_text_button_do_magic_bg_video">
              {/* <video src="/src/assets/dr_strange_spark_x.mp4" ref={igniteSparks}></video> */}
              {/* <video src="/src/assets/" ref={igniteSparks}></video> */}
              {/* <img src="/src/assets/dr-strange-spark-x-unscreen.gif" alt="" /> */}
            </div>
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
      ) : (
        <div className="ShareText_main_preview_op_text">
          <div className="ShareText_main_preview_op_text_back_btn" onClick={()=>setOpenTex(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#B7B7B7"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
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
              <QRCode className="qr_code_image" value={shareTextUrl}/>
            </div>
          </div>
          <div className="EnjoyText_main_top_bottom_text_receive_code_preview">
            <p>{225265}</p>
          </div>
          <div className="EnjoyText_main_top_bottom_text_receive_title_url_cpy_main_box">
            <div className="EnjoyText_main_top_bottom_text_receive_title_url_cpy">
              <span className="EnjoyText_main_top_bottom_text_receive_title_url_cpy_url">
                {shareTextUrl}
              </span>
              <span className="EnjoyText_main_top_bottom_text_receive_title_url_cpy_clipboard" onClick={()=>copyToClipBoard(shareTextUrl)}>
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
