import { useEffect, useState } from "react";
import EnjoyText from "../EnjoyText/EnjoyText";
import EnjoyImage from "../EnjoyImage/EnjoyImage";
import "./Landing.css";
import myProfileImage from "../../assets/background_image_2.png";
import homeVideo from "../../assets/home_animation_crop.mp4";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch , useSelector } from "react-redux";
import {
  fetchUserProfileDataThunk,
  userProfileApiData,
} from "../../reduxSetup/features/apiCollections/userProfileData/centralExportUserProfileData";

const Landing = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [textTabOpenStatus, setTextTabOpenStatus] = useState(false);
  const [imageTabOpenStatus, setImageTabOpenStatus] = useState(false);
  const [historyOptionEnable , setHistoryOptionEnable] = useState(false);

  // HANDEL REDUX
  const userProfileData = useSelector(userProfileApiData);

  useEffect(()=>{
    if(!userProfileData){
      dispatch(fetchUserProfileDataThunk());
    }
  },[dispatch, userProfileData])

  const handelToCloseTextTab = (action) => {
    if (action) {
      localStorage.setItem("openTab", "text");
    } else {
      localStorage.setItem("openTab", "none");
    }
    setTextTabOpenStatus(action);
  };
  const handelToCloseImageTab = (action) => {
    if (action) {
      localStorage.setItem("openTab", "image");
    } else {
      localStorage.setItem("openTab", "none");
    }
    setImageTabOpenStatus(action);
  };

  useEffect(() => {
    const actionTab = localStorage.getItem("openTab");
    if (actionTab == "text") {
      setTextTabOpenStatus(true);
    } else if (actionTab === "image") {
      setImageTabOpenStatus(true);
    } else {
      setTextTabOpenStatus(false);
      setImageTabOpenStatus(false);
    }
  }, []);

  // verify token if token exist
  const verifyTheToken = async (token) => {
    // console.log("Api Call for token");
    // const api = `${import.meta.env.VITE_SERVER_URL}/api/user/verify-token`;
    const api = `http://localhost:8080/api/user/verifyUserAuthToken`;
    const response = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const json_data = await response.json();
    // console.log("response token api : ", json_data);
    return {
      api_response: response.ok,
      data: json_data,
    };
  };

  useEffect(() => {
    const authenticateUser = async () => {
      const isTokenExist = localStorage.getItem("authToken");
      if (!isTokenExist) {
        return;
      }
      const { api_response, data } = await verifyTheToken(isTokenExist);
      if (api_response && data.responseStatus === "success") {
        setHistoryOptionEnable(true);
        return;
      }
      toast.error("Session Expire Login Again", {
        style: {
          color: "#d92525e1",
        },
      });
    };
    authenticateUser();
  }, [navigator]);

  return (
    <div className="landing_main">
      {
        historyOptionEnable?<div className="check_your_history" onClick={()=>navigator('/activity-history')}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#B7B7B7"><path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/></svg></div>:null
      }
      {textTabOpenStatus ? (
        <div className="Landing_over_lay">
          <EnjoyText
            TextTabOpenAction={(action) => handelToCloseTextTab(action)}
          />
        </div>
      ) : null}
      {imageTabOpenStatus ? (
        <div className="Landing_over_lay">
          <EnjoyImage
            ImageTabOpenAction={(action) => handelToCloseImageTab(action)}
          />
        </div>
      ) : null}
      <div className="landing_main_arrange_width">
        <div className="landing_main_top">
          {/* <div className="landing_main_top_navbar"> */}
          <div
            className="landing_main_top_navbar_vishal_profile"
            onClick={() => window.open("https://vishalkumar1007.github.io")}
          >
            <div className="landing_main_top_navbar_vishal_profile_light"></div>
            <img src={myProfileImage} alt="" />
          </div>
          <div className="landing_main_top_navbar_login">
            <button >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="29px"
                fill="#999999"
              >
                <path d="M144.74-258.41v-47.88h670.52v47.88H144.74Zm0-197.89v-47.88h670.52v47.88H144.74Zm0-197.88v-47.88h670.52v47.88H144.74Z" />
              </svg>
            </button>
          </div>
          {/* </div> */}
        </div>
        <div className="landing_main_bottom">
          <span
            className="landing_main_bottom_toggle"
            onClick={() => navigator("/auth")}
          >
            ✨ Login to save data forever
          </span>
          <div className="landing_main_bottom_intro_text">
            Share With Multiverse
          </div>
          <div className="landing_main_bottom_action_and_animation">
            <div className="landing_main_bottom_open_share_text"></div>
            <div className="landing_main_bottom_animation">
              <video src={homeVideo} autoPlay loop muted playsInline></video>
            </div>

            <div className="landing_main_bottom_open_share_image"></div>
          </div>
        </div>
        <div className="landing_main_bottom_later">
          <button
            className="landing_main_open_text_share"
            onClick={() => handelToCloseTextTab(true)}
          >
            Enjoy Text
          </button>
          <button
            className="landing_main_open_image_share"
            onClick={() => handelToCloseImageTab(true)}
          >
            Enjoy Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
