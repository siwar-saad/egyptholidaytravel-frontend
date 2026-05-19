import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./page/Home";

import Login from "./page/login_signup/Login";
import Signup from "./page/login_signup/Signup";
import ForgotPassword from "./page/login_signup/ForgotPassword";
import ResetPassword from "./page/login_signup/ResetPassword";

import Packages from "./page/Packages";
import Hotels from "./page/hotel/Hotels";
import FlightComingSoon from "./page/flight/flightcomingsoon";

import Admin from "./page/admin/Admin";
import UserProfile from "./page/client/profile/UserProfile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route
          path="/login"
          element={token && user ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/signup"
          element={token && user ? <Navigate to="/" replace /> : <Signup />}
        />

        <Route
          path="/forgot-password"
          element={
            token && user ? <Navigate to="/" replace /> : <ForgotPassword />
          }
        />

        <Route
          path="/reset-password"
          element={
            token && user ? <Navigate to="/" replace /> : <ResetPassword />
          }
        />

        {/* MAIN PAGES */}
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/hotels" element={<Hotels />} />

        {/* FLIGHT COMING SOON */}
        <Route path="/flight" element={<FlightComingSoon />} />
        <Route path="/flights" element={<FlightComingSoon />} />

        {/* USER PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;