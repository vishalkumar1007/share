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
          <div className="EnjoyText_main_top_bottom_text_receive"></div>
        </div>
      </div>
    </div>
  );
};

export default EnjoyText;
