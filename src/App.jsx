import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./page/Home";
import Login from "./page/login_signup/Login";
import Signup from "./page/login_signup/Signup";
import ForgotPassword from "./page/login_signup/ForgotPassword";
import ResetPassword from "./page/login_signup/ResetPassword";

import BasicFacts from "./page/BasicFacts";
import History from "./page/History";
import Geography from "./page/Geography";
import DestinationsInfo from "./page/DestinationsInfo";
import Activities from "./page/Activities";
import Food from "./page/Food";
import Packages from "./page/Packages";

import Admin from "./page/admin/Admin";
import UserProfile from "./page/client/profile/UserProfile";
import Hotels from "./page/hotel/Hotels";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/basic-facts" element={<BasicFacts />} />
        <Route path="/history" element={<History />} />
        <Route path="/geography" element={<Geography />} />
        <Route path="/destinations-info" element={<DestinationsInfo />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/food" element={<Food />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/hotels" element={<Hotels />} />

        {/* PRIVATE ROUTES */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;