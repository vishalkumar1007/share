import { useEffect, useState } from "react";
import EnjoyText from "../EnjoyText/EnjoyText";
import EnjoyImage from "../EnjoyImage/EnjoyImage";
import "./Landing.css";

const Landing = () => {
  const[textTabOpenStatus , setTextTabOpenStatus] = useState(false);
  const[imageTabOpenStatus , setImageTabOpenStatus] = useState(false);

  const handelToCloseTextTab = (action)=>{
    if (action) {
      localStorage.setItem('openTab','text');
    } else {
      localStorage.setItem('openTab','none');
    }
    setTextTabOpenStatus(action)
  }
  const handelToCloseImageTab = (action)=>{
    if (action) {
      localStorage.setItem('openTab','image');
    } else {
      localStorage.setItem('openTab','none');
    }
    setImageTabOpenStatus(action)
  }

  useEffect(()=>{
    const actionTab = localStorage.getItem('openTab');
    if(actionTab=='text'){
      setTextTabOpenStatus(true);
    }else if(actionTab==='image'){
      setImageTabOpenStatus(true);
    }else{
      setTextTabOpenStatus(false);
      setImageTabOpenStatus(false);
    }
  },[])

  return (
    <div className="landing_main">
      {
        textTabOpenStatus?
        <div className="Landing_over_lay">
          <EnjoyText TextTabOpenAction={(action)=>handelToCloseTextTab(action)}/>
        </div>:null
      }
      {
        imageTabOpenStatus?
        <div className="Landing_over_lay">
          <EnjoyImage ImageTabOpenAction={(action)=>handelToCloseImageTab(action)}/>
        </div>:null
      }
      <div className="landing_main_arrange_width">
        <div className="landing_main_top">
            {/* <div className="landing_main_top_navbar"> */}
                <div className="landing_main_top_navbar_vishal_profile">
                    <div className="landing_main_top_navbar_vishal_profile_light"></div>
                    <img src="/src/assets/background_image_2.png" alt="" />
                </div>
                <div className="landing_main_top_navbar_login">
                    <button><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="29px" fill="#999999"><path d="M144.74-258.41v-47.88h670.52v47.88H144.74Zm0-197.89v-47.88h670.52v47.88H144.74Zm0-197.88v-47.88h670.52v47.88H144.74Z"/></svg></button>
                </div>
            {/* </div> */}
        </div>
        <div className="landing_main_bottom">
            <span className="landing_main_bottom_toggle">✨ Login to save data forever</span>
          <div className="landing_main_bottom_intro_text">
            Share With Multiverse
          </div>
          <div className="landing_main_bottom_action_and_animation">
            <div className="landing_main_bottom_open_share_text"></div>
            <div className="landing_main_bottom_animation">
              <video
                src="/src/assets/home_animation_crop.mp4"
                autoPlay
                loop
                muted
                playsInline
              ></video>
            </div>

            <div className="landing_main_bottom_open_share_image"></div>
          </div>
        </div>
        <div className="landing_main_bottom_later">
            <button className="landing_main_open_text_share" onClick={()=>handelToCloseTextTab(true)}>Enjoy Text</button>
            <button className="landing_main_open_image_share"onClick={()=>handelToCloseImageTab(true)}>Enjoy Image</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
