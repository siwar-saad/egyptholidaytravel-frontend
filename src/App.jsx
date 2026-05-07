import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/login_signup/Login";
import BasicFacts from "./page/BasicFacts";
import History from "./page/History";
import Geography from "./page/Geography";
import DestinationsInfo from "./page/DestinationsInfo";
import Activities from "./page/Activities";
import Food from "./page/Food";
import Packages from "./page/Packages";
import Admin from "./page/admin/Admin";
import Signup from "./page/login_signup/Signup";
import ForgotPassword from "./page/login_signup/ForgotPassword";
import ResetPassword from "./page/login_signup/ResetPassword";
import UserProfile from "./page/client/profile/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/basic-facts" element={<BasicFacts />} />
        <Route path="/history" element={<History />} />
        <Route path="/geography" element={<Geography />} />
        <Route path="/destinations-info" element={<DestinationsInfo />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/food" element={<Food />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
