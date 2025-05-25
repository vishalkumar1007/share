import "./ActivityHistory.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  fetchUserProfileDataThunk,
  userProfileApiIsLoading,
  userProfileApiData,
  // userProfileApiIsError,
  // userProfileApiErrorMessage,
} from "../../reduxSetup/features/apiCollections/userProfileData/centralExportUserProfileData";

const ActivityHistory = () => {
  const dispatch = useDispatch();
  //   const userProfileData = useSelector(selectUserProfileData);
  const [profileViewFeatureSection, setProfileViewFeatureSection] = useState(
    "textMultiverseHistory"
  );

  const handelProfileActiveFeatureSection = (makeActive) => {
    setProfileViewFeatureSection(makeActive);
  };

  // HANDEL REDUX
  const userProfileData = useSelector(userProfileApiData);
  const userProfileDataLoading = useSelector(userProfileApiIsLoading);
  // const userProfileDataError = useSelector(userProfileApiIsError);
  // const userProfileDataErrorMessage = useSelector(userProfileApiErrorMessage);

  useEffect(() => {
    if (!userProfileData) {
      dispatch(fetchUserProfileDataThunk());
    }
  }, [dispatch, userProfileData]);


  return (
    <div className="activityHistory_main">
      <div className="activityHistory_main_arrange_width">
        <div className="activityHistory_main_arrange_width">
          <div className="activityHistory_main_make_center_contain_box">
            <div className="activityHistory_left_container">
              <div className="activityHistory_left_image_box_main">
                <div
                  className="activityHistory_left_image_circle"
                  style={{
                    backgroundColor: `#47a778`,
                  }}
                >
                  {userProfileData?.data.firstName[0]}
                </div>
                <div className="activityHistory_left_image_user_name">
                  <span>{`${userProfileData?.data.firstName} ${userProfileData?.data.lastName}`}</span>
                </div>
              </div>
              <div className="activityHistory_left_option_box_main">
                <div
                  className="activityHistory_left_option_box_main_basic_detail_section"
                  onClick={() => {
                    handelProfileActiveFeatureSection("textMultiverseHistory");
                  }}
                  style={{
                    backgroundColor:
                      profileViewFeatureSection === "textMultiverseHistory"
                        ? "#242323"
                        : null,
                  }}
                >
                  <div className="activityHistory_left_option_box_main_section_heading">
                    <span>Text Multiverse History</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#515151"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </div>
                <div
                  className="activityHistory_left_option_box_main_edit_profile_section"
                  onClick={() => {
                    handelProfileActiveFeatureSection("updateProfile");
                  }}
                  style={{
                    backgroundColor:
                      profileViewFeatureSection === "updateProfile"
                        ? "#242323"
                        : null,
                  }}
                >
                  <div className="activityHistory_left_option_box_main_section_heading">
                    <span>Image Multiverse History</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#515151"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="activityHistory_right_container">
              {
                // <TextMultiverseHistoryDataComponent />
                profileViewFeatureSection === "textMultiverseHistory" ? (
                  userProfileDataLoading ? null : (
                    userProfileData?.data.userData.textMultiverseData.length===0?<ImageMultiverseHistoryDataComponent comp='Text'/>:
                    userProfileData?.data.userData.textMultiverseData.map(
                      (data) => (
                        <TextMultiverseHistoryDataComponent
                          key={data.multiverseCode}
                          data={data}
                        />
                      )
                    )
                  )
                ) : (
                  <ImageMultiverseHistoryDataComponent comp='Image'/>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TextMultiverseHistoryDataComponent = ({ data }) => {
  const [openDeleteOperation, setOpenDeleteOperation] = useState(false);
  const [isMultiverseCodeLive, setIsMultiverseCodeLive] = useState(false);
  const [loadingMultiverseCodeLive, setLoadingMultiverseCodeLive] =
    useState(false);

  const deleteFunction = () => {
    toast.error("Feature Unbailable , coming soon", {
      style: {
        color: "#d92525e1",
      },
    });
    // setOpenDeleteOperation(true);
    // setTimeout(()=>{
    //   setOpenDeleteOperation(false);
    // },1000)
  };

  const makeMultiverseCodeLive = () => {
    toast.error("Feature Unbailable , coming soon", {
      style: {
        color: "#d92525e1",
      },
    });
    // setLoadingMultiverseCodeLive(true);
    // setInterval(()=>{
    //   setIsMultiverseCodeLive(true);
    //   setLoadingMultiverseCodeLive(false);
    // },2000)
  };

  return (
    <div className="TextMultiverseHistoryDataComponent_main">
      <div className="TextMultiverseHistoryDataComponent_main_arrange_width">
        <div className="TextMultiverseHistoryDataComponent_main_text_status">
          {isMultiverseCodeLive ? (
            <div className="TextMultiverseHistoryDataComponent_main_text_status_main">
              <div className="server-status-relative">
                <span className="server-status" type="up"></span>
              </div>
              <p className="TextMultiverseHistoryDataComponent_main_text_status_active">
                Live
              </p>
            </div>
          ) : (
            <div className="TextMultiverseHistoryDataComponent_main_text_status_main_inactive">
              <button
                className="TextMultiverseHistoryDataComponent_main_text_status_inactive"
                onClick={makeMultiverseCodeLive}
              >
                {loadingMultiverseCodeLive ? (
                  <span className="server-status-inactive" type="slow"></span>
                ) : null}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 7v4" />
                  <path d="M7.998 9.003a5 5 0 1 0 8-.005" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="TextMultiverseHistoryDataComponent_main_text_view">
          <p>{data?.codeMappedText}</p>
        </div>
        <div className="TextMultiverseHistoryDataComponent_main_text_multiverse_code">
          <p>{data?.multiverseCode}</p>
        </div>
        <div className="TextMultiverseHistoryDataComponent_main_text_delete_main">
          <div className="TextMultiverseHistoryDataComponent_main_text_delete">
            <div
              id="delete-wrapper"
              className={openDeleteOperation ? "open" : null}
              onClick={deleteFunction}
            >
              <div className="cap"></div>
              <div className="inner-delete">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageMultiverseHistoryDataComponent = ({comp=''}) => {
  return (
    <div
      className="TextMultiverseHistoryDataComponent_main"
      style={{ color: "gray" }}
    >
      {comp} Multiverse History Empty
    </div>
  );
};

export default ActivityHistory;
