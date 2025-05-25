import { useEffect, useState } from "react";
import Landing from "./pages/Landing/Landing";
import Auth from "./pages/Auth/Auth";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ActivityHistory from "./pages/ActivityHistory/ActivityHistory";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  const [whitListIp, setWhitListIp] = useState(""); // make ipv4 whitelist
  const [whitListIpV6, setWhitListIpV6] = useState(""); // make ipv6 whitelist
  const [allowAccessContent, setAllowAccessContent] = useState(true); // make it false
  const [loadingPage, setLoadingPage] = useState(true);
  const [userIpData, setUserIpData] = useState("");

  useEffect(() => {
    // const checkUserCompliances = (userIp='' ) => {
    //   console.log('User current IP : ',userIp);
    //   if (whitListIp === userIp || whitListIpV6 === userIp) {
      //     return true;
    //   }
    //   return false;
    // };
    
    const fetchUserIp = async () => {
      try {
        setLoadingPage(true);
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setUserIpData(data.ip);
        console.log('User current IP : ',data.ip);
        // const checkCompliances = checkUserCompliances(data.ip);
        // setAllowAccessContent(checkCompliances);
        setLoadingPage(false);
      } catch (error) {
        console.log("Error:", error);
      }
    };


    fetchUserIp();

  }, [whitListIp, whitListIpV6]);

  return loadingPage ? (
    <div className="start_loading"></div>
  ) : (
    <div className="App">
      {allowAccessContent ? (
        <BrowserRouter basename="/share">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/Auth" element={<Auth />} />
            <Route path="/Auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/activity-history" element={<ActivityHistory />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <PageNotFound ipData={userIpData} />
      )}
    </div>
  );
}

export default App;
