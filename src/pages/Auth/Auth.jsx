import "./Auth.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigator = useNavigate();

  // manual  login

  const [userInputEmailId, setUserInputEmailId] = useState("");
  const [userInputEmailVerifyError, setUserInputEmailVerifyError] =
    useState(false);
  const [userInputPassword, setUserInputPassword] = useState("");
  const [userInputPasswordError, setUserInputPasswordError] = useState(false);

  // manual signup
  const [useFirstNameSignup, setUseFirstNameSignup] = useState("");
  const [userLastNameSignup, setUserLastNameSignup] = useState("");
  const [userInputEmailIdSignup, setUserInputEmailIdSignup] = useState("");
  const [userPasswordSignup, setUserPasswordSignup] = useState("");
  const [userConformPasswordSignup, setUserConformPasswordSignup] =
    useState("");

  const [isUseFirstNameSignupError, setIsUseFirstNameSignupError] =
    useState(false);
  const [isUserLastNameSignupError, setIsUserLastNameSignupError] =
    useState(false);
  const [isUserInputEmailIdSignupError, setIsUserInputEmailIdSignupError] =
    useState(false);
  const [isUserPasswordSignupError, setIsUserPasswordSignupError] =
    useState(false);
  const [
    isUserConformPasswordSignupError,
    setIsUserConformPasswordSignupError,
  ] = useState(false);

  const [UseFirstNameSignupErrorMsg, setUseFirstNameSignupErrorMsg] =
    useState("invalid input");
  const [UserLastNameSignupErrorMsg, setUserLastNameSignupErrorMsg] =
    useState("invalid input");
  const [UserInputEmailIdSignupErrorMsg, setUserInputEmailIdSignupErrorMsg] =
    useState("invalid input");
  const [UserPasswordSignupErrorMsg, setUserPasswordSignupErrorMsg] =
    useState("invalid input");
  const [
    UserConformPasswordSignupErrorMsg,
    setUserConformPasswordSignupErrorMsg,
  ] = useState("invalid input");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  

  // api call for sign-up

  const handelToSIgnUpUser = async () => {
    if (verifyUserInputForSignUP()) {
      setLoading(true);
      const { success, json_res } = await handelToSignUpUserWithApi();
      if (success === true && json_res.responseStatus === "success") {
        toast.success(`${json_res.msg}`, {
          style: {
            color: "#19b030d0",
          },
        });
        setIsLogin(true);
        setLoading(false);
        navigator("/");
      } else if (success === false) {
        toast.error(`${json_res.msg}`, {
          style: {
            color: "#d92525e1",
          },
        });
        setLoading(false);
      }
    }
  };

  const handelToSignUpUserWithApi = async () => {
    // const api = `${import.meta.env.VITE_SERVER_URL}/api/user/sign-up`;
    try {
      const api = `http://localhost:8080/api/user/signup`;
    const body = {
      firstName: `${useFirstNameSignup}`,
      lastName: `${userLastNameSignup}`,
      email: `${userInputEmailIdSignup}`,
      password: `${userPasswordSignup}`,
    };
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json_res = await response.json();

    if (json_res.responseStatus === "success" && json_res.accessToken) {
      localStorage.setItem("authToken", json_res.accessToken);
    }

    return response.ok && json_res.responseStatus === "success"
      ? { success: true, json_res }
      : { success: false, json_res };
    } catch (error) {
      return {
        success: false,
        json_res: { msg: "Something wrong , check your internet", error },
      };
    }
  };

  // api call for login
  const handelToLoginUser = async () => {
    setLoading(true);
    if (verifyUserInputForLogin()) {
      const { success, json_res } = await handelToLoginUserWithApi();
      console.log("login : ", success, "and ", json_res);

      if (success === true && json_res.responseStatus === "success") {
        toast.success(
          `${json_res.msg} welcome ${json_res.payloadData.firstName}`,
          {
            style: {
              color: "#19b030d0",
            },
          }
        );
        navigator("/");
        setLoading(false);
      } else if (success === false) {
        toast.error(`${json_res.msg}`, {
          style: {
            color: "#d92525e1",
          },
        });
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const handelToLoginUserWithApi = async () => {
    // const api = `${import.meta.env.VITE_SERVER_URL}/api/user/login?email=${userInputEmailId}&password=${userInputPassword}`;
    try {
      const api = `http://localhost:8080/api/user/login?email=${userInputEmailId}&password=${userInputPassword}`;

      const response = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json_res = await response.json();

      if (json_res.responseStatus === "success" && json_res.accessToken) {
        localStorage.setItem("authToken", json_res.accessToken);
      }
      return response.ok && json_res.responseStatus === "success"
        ? { success: true, json_res }
        : { success: false, json_res };
    } catch (error) {
      return {
        success: false,
        json_res: { msg: "Something wrong , check your internet", error },
      };
    }
  };

  // Sign up with manual logic

  useEffect(() => {
    if (useFirstNameSignup) {
      if (useFirstNameSignup.length <= 4 || useFirstNameSignup.length >= 12) {
        setUseFirstNameSignupErrorMsg(
          "character must be more than 4 and less than 12"
        );
        setIsUseFirstNameSignupError(true);
      } else if (/[0-9]/.test(useFirstNameSignup)) {
        setUseFirstNameSignupErrorMsg("numbers are not allowed");
        setIsUseFirstNameSignupError(true);
      } else if (/[@!#%&*()`\-=+{}]/.test(useFirstNameSignup)) {
        setUseFirstNameSignupErrorMsg(
          "spacial character {@!#%&*()`-=+} not allow"
        );
        setIsUseFirstNameSignupError(true);
      } else {
        setIsUseFirstNameSignupError(false);
      }
    } else {
      setIsUseFirstNameSignupError(false);
    }
  }, [useFirstNameSignup]);

  useEffect(() => {
    if (userLastNameSignup) {
      if (userLastNameSignup.length <= 1 || userLastNameSignup.length >= 10) {
        setUserLastNameSignupErrorMsg(
          "character must be more than 1 and less than 10"
        );
        setIsUserLastNameSignupError(true);
      } else if (/[0-9]/.test(userLastNameSignup)) {
        setUserLastNameSignupErrorMsg("numbers are not allowed");
        setIsUserLastNameSignupError(true);
      } else if (/[@!#%&*()`\-=+{}]/.test(userLastNameSignup)) {
        setUserLastNameSignupErrorMsg(
          "spacial character {@!#%&*()`-=+} not allow"
        );
        setIsUserLastNameSignupError(true);
      } else {
        setIsUserLastNameSignupError(false);
      }
    } else {
      setIsUserLastNameSignupError(false);
    }
  }, [userLastNameSignup]);

  useEffect(() => {
    if (userInputEmailIdSignup) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(userInputEmailIdSignup)) {
        setUserInputEmailIdSignupErrorMsg("invalid input email");
        setIsUserInputEmailIdSignupError(true);
      } else {
        setIsUserInputEmailIdSignupError(false);
      }
    } else {
      setIsUserInputEmailIdSignupError(false);
    }
  }, [userInputEmailIdSignup]);

  useEffect(() => {
    if (userPasswordSignup) {
      if (userPasswordSignup.length < 4 || userPasswordSignup.length > 20) {
        setUserPasswordSignupErrorMsg(
          "Password character must be more than 4 and less then 20"
        );
        setIsUserPasswordSignupError(true);
      } else if (
        ["$", "!", "%", "^", "*", "(", ")", "|"].some((operator) =>
          userPasswordSignup.includes(operator)
        )
      ) {
        setUserPasswordSignupErrorMsg(
          "Not allow to use these character $ ! % ^ | ( )"
        );
        setIsUserPasswordSignupError(true);
      } else if (!/\d/.test(userPasswordSignup)) {
        setUserPasswordSignupErrorMsg("Password must be contain number");
        setIsUserPasswordSignupError(true);
      } else if (
        !["@", "#", "-", ".", "/"].some((operator) =>
          userPasswordSignup.includes(operator)
        )
      ) {
        setUserPasswordSignupErrorMsg(
          "Password must be contain special character"
        );
        setIsUserPasswordSignupError(true);
      } else if (!/[A-Z]/.test(userPasswordSignup)) {
        setUserPasswordSignupErrorMsg(
          "Password must contain at least one capital letter"
        );
        setIsUserPasswordSignupError(true);
      } else {
        setUserPasswordSignupErrorMsg("Seems Like All Set For Update Password");
        setIsUserPasswordSignupError(false);
      }
    } else if (userPasswordSignup === "") {
      setUserPasswordSignupErrorMsg("");
      setIsUserPasswordSignupError(false);
    }
  }, [userPasswordSignup]);

  useEffect(() => {
    if (userConformPasswordSignup) {
      if (
        !(
          userConformPasswordSignup.length > 4 ||
          userConformPasswordSignup.length < 20
        )
      ) {
        setUserConformPasswordSignupErrorMsg(
          "Password character must be more than 4 and less then 20"
        );
        setIsUserConformPasswordSignupError(true);
      } else if (
        ["$", "!", "%", "^", "*", "(", ")", "|"].some((operator) =>
          userConformPasswordSignup.includes(operator)
        )
      ) {
        setUserConformPasswordSignupErrorMsg(
          '"Not allow to use these character $ ! % ^ | ( ) '
        );
        setIsUserConformPasswordSignupError(true);
      } else if (!/\d/.test(userConformPasswordSignup)) {
        setUserConformPasswordSignupErrorMsg("Password must be contain number");
        setIsUserConformPasswordSignupError(true);
      } else if (
        !["@", "#", "-", ".", "/"].some((operator) =>
          userConformPasswordSignup.includes(operator)
        )
      ) {
        setUserConformPasswordSignupErrorMsg(
          "Password must be contain special character"
        );
        setIsUserConformPasswordSignupError(true);
      } else if (!/[A-Z]/.test(userConformPasswordSignup)) {
        setUserConformPasswordSignupErrorMsg(
          "Password must contain at least one capital letter"
        );
        setIsUserConformPasswordSignupError(true);
      } else if (userPasswordSignup !== userConformPasswordSignup) {
        setUserConformPasswordSignupErrorMsg("Password not same");
        setIsUserConformPasswordSignupError(true);
      } else {
        setUserConformPasswordSignupErrorMsg(
          "Seems Like All Set For Update Password"
        );
        setIsUserConformPasswordSignupError(false);
      }
    } else if (userConformPasswordSignup === "") {
      setUserConformPasswordSignupErrorMsg("");
      setIsUserConformPasswordSignupError(false);
    }
  }, [userConformPasswordSignup, userPasswordSignup]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    // console.log(userInputEmail);
    if (userInputEmailId) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setUserInputEmailVerifyError(!emailPattern.test(userInputEmailId));
    } else {
      setUserInputEmailVerifyError(false);
    }
  }, [userInputEmailId]);

  useEffect(() => {
    if (userInputPassword.length > 0) {
      setUserInputPasswordError(false);
    }
  }, [userInputPassword]);

  const verifyUserInputForLogin = () => {
    if (userInputEmailVerifyError) {
      toast.error("Invalid email id", {
        style: {
          color: "#d92525e1",
        },
      });
      return false;
    } else if (userInputEmailId.length === 0) {
      setUserInputEmailVerifyError(true);
      toast.error("Please enter email id", {
        style: {
          color: "#d92525e1",
        },
      });
      return false;
    } else if (userInputPassword.length === 0) {
      setUserInputPasswordError(true);
      toast.error("Please enter password", {
        style: {
          color: "#d92525e1",
        },
      });
      return false;
    } else {
      return true;
    }
  };

  const verifyUserInputForSignUP = () => {
    if (useFirstNameSignup.length === 0 || isUseFirstNameSignupError) {
      toast.error("Error in First Name", {
        style: {
          color: "#d92525e1",
        },
      });
      setIsUseFirstNameSignupError(true);
      return false;
    } else if (userLastNameSignup.length === 0 || isUserLastNameSignupError) {
      toast.error("Error in Last Name", {
        style: {
          color: "#d92525e1",
        },
      });
      setIsUserLastNameSignupError(true);
      return false;
    } else if (
      userInputEmailIdSignup.length === 0 ||
      isUserInputEmailIdSignupError
    ) {
      toast.error("Error in email", {
        style: {
          color: "#d92525e1",
        },
      });
      setIsUserInputEmailIdSignupError(true);
      return false;
    } else if (userPasswordSignup.length === 0 || isUserPasswordSignupError) {
      toast.error("Error in password", {
        style: {
          color: "#d92525e1",
        },
      });
      setIsUserPasswordSignupError(true);
      return false;
    } else if (
      userConformPasswordSignup.length === 0 ||
      isUserConformPasswordSignupError
    ) {
      toast.error("Error in conform password", {
        style: {
          color: "#d92525e1",
        },
      });
      setIsUserConformPasswordSignupError(true);
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="Auth_main">
      <div className="auth-container">
        <div className="form-wrapper">
          <>
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            {isLogin ? (
              <div className="Auth_main_login_section">
                <input
                  className="Auth_input"
                  type="email"
                  placeholder="Email Address"
                  required
                  id={userInputEmailVerifyError ? "Auth_input_error" : null}
                  onChange={(e) => setUserInputEmailId(e.target.value)}
                  value={userInputEmailId}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handelToLoginUser();
                    }
                  }}
                  // id="forgot_password_email_verify_error"
                />
                <input
                  className="Auth_input"
                  type="password"
                  placeholder="Password"
                  required
                  id={userInputPasswordError ? "Auth_input_error" : null}
                  onChange={(e) => setUserInputPassword(e.target.value)}
                  value={userInputPassword}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handelToLoginUser();
                    }
                  }}
                />

                <button
                  type="submit"
                  className="btn"
                  onClick={handelToLoginUser}
                >
                  {loading ? (
                    <div className="loader">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            ) : (
              <div className="Auth_main_signup_section">
                <div className="Auth_main_signup_section_input_div">
                  <input
                    className="Auth_input"
                    type="text"
                    placeholder="First Name"
                    required
                    id={
                      isUseFirstNameSignupError
                        ? "forgot_password_email_verify_error"
                        : null
                    }
                    onChange={(e) => setUseFirstNameSignup(e.target.value)}
                    value={useFirstNameSignup}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handelToSIgnUpUser();
                      }
                    }}
                  />
                  <p className="signup_error_msg_show">
                    {isUseFirstNameSignupError
                      ? `${UseFirstNameSignupErrorMsg}`
                      : null}
                  </p>
                </div>
                <div className="Auth_main_signup_section_input_div">
                  <input
                    className="Auth_input"
                    type="text"
                    placeholder="Last Name"
                    required
                    id={
                      isUserLastNameSignupError
                        ? "forgot_password_email_verify_error"
                        : null
                    }
                    onChange={(e) => setUserLastNameSignup(e.target.value)}
                    value={userLastNameSignup}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handelToSIgnUpUser();
                      }
                    }}
                  />
                  <p className="signup_error_msg_show">
                    {isUserLastNameSignupError
                      ? `${UserLastNameSignupErrorMsg}`
                      : null}
                  </p>
                </div>
                <div className="Auth_main_signup_section_input_div">
                  <input
                    className="Auth_input"
                    type="email"
                    placeholder="Email Address"
                    required
                    id={
                      isUserInputEmailIdSignupError
                        ? "forgot_password_email_verify_error"
                        : null
                    }
                    onChange={(e) => setUserInputEmailIdSignup(e.target.value)}
                    value={userInputEmailIdSignup}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handelToSIgnUpUser();
                      }
                    }}
                  />
                  <p className="signup_error_msg_show">
                    {isUserInputEmailIdSignupError
                      ? `${UserInputEmailIdSignupErrorMsg}`
                      : null}
                  </p>
                </div>
                <div className="Auth_main_signup_section_input_div">
                  <input
                    className="Auth_input"
                    type="password"
                    placeholder="Password"
                    required
                    id={
                      isUserPasswordSignupError
                        ? "forgot_password_email_verify_error"
                        : null
                    }
                    onChange={(e) => setUserPasswordSignup(e.target.value)}
                    value={userPasswordSignup}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handelToSIgnUpUser();
                      }
                    }}
                  />
                  <p className="signup_error_msg_show">
                    {isUserPasswordSignupError
                      ? `${UserPasswordSignupErrorMsg}`
                      : null}
                  </p>
                </div>
                <div className="Auth_main_signup_section_input_div">
                  <input
                    className="Auth_input"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    id={
                      isUserConformPasswordSignupError
                        ? "forgot_password_email_verify_error"
                        : null
                    }
                    onChange={(e) =>
                      setUserConformPasswordSignup(e.target.value)
                    }
                    value={userConformPasswordSignup}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handelToSIgnUpUser();
                      }
                    }}
                  />
                  <p className="signup_error_msg_show">
                    {isUserConformPasswordSignupError
                      ? `${UserConformPasswordSignupErrorMsg}`
                      : null}
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn"
                  onClick={() => handelToSIgnUpUser()}
                >
                  {loading ? (
                    <div className="loader">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            )}

            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span onClick={toggleForm}>
                {isLogin ? "Sign Up " : "Login "}
              </span>
              ||
              <span onClick={() => navigator("/auth/forgot-password")}>
                {" "}
                ForgotPassword
              </span>
            </p>
          </>
        </div>
      </div>
    </div>
  );
};

export default Auth;
