import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing_main">
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
            <span className="landing_main_bottom_toggle">✨ Login to save forever</span>
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
            <button className="landing_main_open_text_share">Enjoy Text</button>
            <button className="landing_main_open_image_share">Enjoy Image</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
