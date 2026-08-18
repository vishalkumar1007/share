import { useEffect, useState } from "react";
import Landing from "./pages/Landing/Landing";
import Auth from "./pages/Auth/Auth";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ActivityHistory from "./pages/ActivityHistory/ActivityHistory";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import DashboardShell from "./pages/Dashboard/DashboardShell";
import {
  OverviewPage,
  ActivityPage,
  ProfilePage,
  SettingsPage,
} from "./pages/Dashboard/sections.jsx";
import Share from "./pages/Share/Share";
import Chat from "./pages/Chat/Chat";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminSettings from "./pages/Admin/AdminSettings";
import TypesRedirect from "./pages/Share/TypesRedirect";
import ReceiveRedirect from "./pages/Receive/Receive";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const routerBasename =
  (import.meta.env.BASE_URL || "/share").replace(/\/$/, "") || "/";

function App() {
  const [whitListIp, setWhitListIp] = useState(""); // make ipv4 whitelist
  const [whitListIpV6, setWhitListIpV6] = useState(""); // make ipv6 whitelist
  const [allowAccessContent, setAllowAccessContent] = useState(true); // make it false
  const [loadingPage, setLoadingPage] = useState(true);
  const [userIpData, setUserIpData] = useState("");

  useEffect(() => {
    const fetchUserIp = async () => {
      try {
        setLoadingPage(true);
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setUserIpData(data.ip);
        console.log("User current IP : ", data.ip);
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
          <BrowserRouter basename={routerBasename}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/Auth" element={<Auth />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/activity-history" element={<ActivityHistory />} />
              <Route path="/dashboard" element={<DashboardShell />}>
                <Route index element={<OverviewPage />} />
                <Route path="activity" element={<ActivityPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="/text" element={<Share fixedType="text" />} />
              <Route path="/text/:code" element={<Share fixedType="text" />} />
              <Route path="/image" element={<Share fixedType="image" />} />
              <Route path="/image/:code" element={<Share fixedType="image" />} />
              <Route path="/file" element={<Share fixedType="file" />} />
              <Route path="/file/:code" element={<Share fixedType="file" />} />
              <Route path="/audio" element={<Share fixedType="audio" />} />
              <Route path="/audio/:code" element={<Share fixedType="audio" />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/types" element={<TypesRedirect />} />
              <Route path="/receive" element={<ReceiveRedirect />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="*" element={<PageNotFound ipData={userIpData} />} />
            </Routes>
          </BrowserRouter>
      ) : (
        <PageNotFound ipData={userIpData} />
      )}
    </div>
  );
}

export default App;
