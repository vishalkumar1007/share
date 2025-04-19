import { useEffect, useState } from "react";
import "./EnjoyText.css";
import { useRef } from "react";
import EnjoyBackground from '../../assets/incoming_dr_strange.mp4'
import ShareText from "../../components/ShareText/ShareText";
import ReceiveText from "../../components/ReceiveText/ReceiveText";
import drStrangeAudioBg from '../../assets/flash-and-quicksilver-sound.mp3'

const EnjoyText = ({ TextTabOpenAction }) => {
  const [openReceiveSection, setOpenReceiveSection] = useState(false);
  const [disableWhileDoMagic, setDisableWhileDoMagic] = useState(false);
  const playMagic = useRef(null);
  const playSound = useRef(null);

  const [doMagic, setDoMagic] = useState(false);
  const actionDoMagic = (action) => {
    if (!action) {
      return;
    }

    playMagic.current?.play();
    playSound.current?.play();
    setDisableWhileDoMagic(true); // disable change tab btn on mobile view
    const timeout = setTimeout(() => {
      setDoMagic(true);
      setDisableWhileDoMagic(false);
    }, 2500);

    return () => clearTimeout(timeout);
  };

  const switchTheShareToReceive = () => {
    if (openReceiveSection) {
      localStorage.setItem("openReceivedSection", false);
    } else {
      localStorage.setItem("openReceivedSection", true);
    }
    setOpenReceiveSection(!openReceiveSection);
    setDoMagic(false);
    playMagic.current.currentTime = 0;
    playMagic.current.pause();
  };

  useEffect(() => {
    const openTabData = localStorage.getItem("openReceivedSection");
    if (openTabData === "null" || openTabData === null) {
      localStorage.setItem("openReceivedSection", false);
    } else if (openTabData === "false" || openTabData === false) {
      setOpenReceiveSection(false);
    } else if (openTabData === "true" || openTabData === true) {
      setOpenReceiveSection(true);
    }
  }, []);

  const handelCloseTab = () => {
    TextTabOpenAction(false);
  };

  return (
    <div className={`EnjoyText_main ${doMagic ? "action_main" : null}`}>
      {/* <img className='lighting_image' src="/src/assets/lighting_dr_str.jpg" alt="" /> */}
      <div className="EnjoyText_main_bg_v">
        <video
          src={EnjoyBackground}
          ref={playMagic}
        ></video>
        <audio ref={playSound}>
          <source
            src={drStrangeAudioBg}
            type="audio/mp3"
          />
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
            <div className="EnjoyText_main_top_bottom_text_send" id="EnjoyText_main_top_bottom_text_send_mobile">
              {openReceiveSection ? (
                <ReceiveText />
              ) : (
                <ShareText actionDoMagic={(action) => actionDoMagic(action)} />
              )}
            </div>
            <div className="EnjoyText_main_top_bottom_text_send" id="EnjoyText_main_top_bottom_text_send_desktop">
              <ShareText actionDoMagic={(action) => actionDoMagic(action)} />
            </div>

            {disableWhileDoMagic ? null : (
              <div
                className={`EnjoyText_main_top_bottom_text_send_lighting_main_switch_context_btn `}
              >
                <button
                  id="switch_share_receive_text"
                  onClick={() => switchTheShareToReceive()}
                  style={{
                    transform: openReceiveSection ? "rotate(180deg)" : null,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#CCCCCC"
                  >
                    <path d="M400-200 120-480l280-280v560Zm-60-145v-270L205-480l135 135Zm220 145v-560l280 280-280 280Z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="EnjoyText_main_top_bottom_animation_joints"></div>
          <div className="EnjoyText_main_top_bottom_text_receive">
            <ReceiveText />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnjoyText;
