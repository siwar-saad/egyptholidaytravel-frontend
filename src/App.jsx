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
import AdminPackages from "./page/admin/Packages";
import Reservations from "./page/admin/Reservations";
import Clients from "./page/admin/Clients";
import Payments from "./page/admin/Payments";
import Messages from "./page/admin/Messages";
import Settings from "./page/admin/Settings";
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
        <Route path="/admin/packages" element={<AdminPackages />} />
        <Route path="/admin/reservations" element={<Reservations />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/messages" element={<Messages />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
