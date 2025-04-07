import { useState } from "react";
import "./EnjoyText.css";
import { useRef } from "react";

const EnjoyText = ({ TextTabOpenAction }) => {
  const [doMagic, setDoMagic] = useState(false);
  const playMagic = useRef(null);
  const igniteSparks = useRef(null);
  const playSound = useRef(null);

  const actionDoMagic = () => {
    playMagic.current?.play();
    igniteSparks.current?.play();
    playSound.current?.play();

    const timeout = setTimeout(() => {
      setDoMagic(true);
    }, 2500);

    return () => clearTimeout(timeout);
  };

  const handelCloseTab = () => {
    TextTabOpenAction(false);
  };

  return (
    <div className={`EnjoyText_main ${doMagic ? "action_main" : null}`}>
      {/* <img className='lighting_image' src="/src/assets/lighting_dr_str.jpg" alt="" /> */}
      <div className="EnjoyText_main_bg_v">
        <video
          src="/src/assets/incoming_dr_strange.mp4"
          ref={playMagic}
        ></video>
        <audio ref={playSound}>
          <source src="/src/assets/flash-and-quicksilver-sound.mp3" type="audio/mp3"/>
        </audio>
      </div>
      <div className="EnjoyText_main_top">
        
        <button
          className="EnjoyText_main_top_close_tab"
          onClick={() => handelCloseTab()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="15px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#5c5c5c"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
        {/* <p className="EnjoyText_main_top_title">Text Multiverse</p> */}
      </div>
      <div className="EnjoyText_main_top_bottom">
        <div className="EnjoyText_main_top_bottom_share_main">
          <div className="EnjoyText_main_top_bottom_text_send_lighting_main">
            <div className="EnjoyText_main_top_bottom_text_send_lighting">
              <div className="EnjoyText_main_top_bottom_text_send_lighting_red_rotate"></div>
            </div>
            <div className="EnjoyText_main_top_bottom_text_send">
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
                    onClick={() => actionDoMagic()}
                  >
                    Open Portal
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="EnjoyText_main_top_bottom_animation_joints"></div>
          <div className="EnjoyText_main_top_bottom_text_receive">
            <div className="EnjoyText_main_top_bottom_text_receive_title">
                <p>Don't worry, we will take care of your laziness. You have three options - pick whichever you're comfortable with.</p>
            </div>
            <div className="EnjoyText_main_top_bottom_text_receive_title_qr_box_main">
              <div className="EnjoyText_main_top_bottom_text_receive_title_qr_box">
                <img src="/src/assets/QR_code.svg" alt="" />
              </div>
            </div>
            <div className="EnjoyText_main_top_bottom_text_receive_code_preview">
                <p>{225265}</p>
            </div>
            <div className="EnjoyText_main_top_bottom_text_receive_title_url_cpy_main_box">
                <div className="EnjoyText_main_top_bottom_text_receive_title_url_cpy">
                  <span className="EnjoyText_main_top_bottom_text_receive_title_url_cpy_url">https://vishalkumar1007.githu.io</span>
                  <span className="EnjoyText_main_top_bottom_text_receive_title_url_cpy_clipboard">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#967171"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
                  </span>
                </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnjoyText;
