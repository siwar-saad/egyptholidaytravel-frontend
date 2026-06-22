import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./page/Home";

import Login from "./page/login_signup/Login";
import Signup from "./page/login_signup/Signup";
import ForgotPassword from "./page/login_signup/ForgotPassword";
import ResetPassword from "./page/login_signup/ResetPassword";

import Packages from "./page/packages/Packages.jsx";
import Hotels from "./page/hotel/Hotels";
import FlightComingSoon from "./page/flight/flightcomingsoon";
import DestinationsComingSoon from "./page/destination/DestinationsComingSoon";

import AdminLayout from "./page/admin/AdminLayout";
import Dashboard from "./page/admin/Dashboard";
import AdminPackages from "./page/admin/Packages";
import AdminHotels from "./page/admin/Hotels";
import Reservations from "./page/admin/Reservations";
import CreateReservation from "./page/admin/CreateReservation";
import Users from "./page/admin/Users";
import Payments from "./page/admin/Payments";
import Messages from "./page/admin/Messages";
import Subscribers from "./page/admin/Subscribers";
import AdminReviews from "./page/admin/AdminReviews";
import Profile from "./page/admin/Profile";
import Settings from "./page/admin/Settings";

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
        <Route path="/destinations" element={<DestinationsComingSoon />} />

        {/* FLIGHTS */}
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

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN PACKAGES */}
        <Route
          path="/admin/packages"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminPackages />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN HOTELS */}
        <Route
          path="/admin/hotels"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminHotels />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN RESERVATIONS */}
        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Reservations />
              </AdminLayout>
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

        {/* ADMIN USERS */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN PAYMENTS */}
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Payments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN MESSAGES */}
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Messages />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN SUBSCRIBERS */}
        <Route
          path="/admin/subscribers"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Subscribers />
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

        {/* ADMIN PROFILE */}
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Profile />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN SETTINGS */}
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Settings />
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
