import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./page/Home";

import Login from "./page/login_signup/Login";
import Signup from "./page/login_signup/Signup";
import ForgotPassword from "./page/login_signup/ForgotPassword";
import ResetPassword from "./page/login_signup/ResetPassword";

import Packages from "./page/Packages";
import Hotels from "./page/hotel/Hotels";
import FlightComingSoon from "./page/flight/flightcomingsoon";

import Admin from "./page/admin/Admin";
import AdminLayout from "./page/admin/AdminLayout";
import AdminReviews from "./page/admin/AdminReviews";
import CreateReservation from "./page/admin/CreateReservation";

import UserProfile from "./page/client/profile/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";

import HomeChatbot from "./components/HomeChatbot";

import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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

        {/* ADMIN CREATE RESERVATION */}
        <Route
          path="/admin/create-reservation"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <CreateReservation />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN REVIEWS */}
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminReviews />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <HomeChatbot />
    </BrowserRouter>
  );
}

export default App;