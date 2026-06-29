import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./page/Home";

import Login from "./page/login_signup/Login";
import Signup from "./page/login_signup/Signup";
import ForgotPassword from "./page/login_signup/ForgotPassword";
import ResetPassword from "./page/login_signup/ResetPassword";

import Packages from "./page/packages/Packages.jsx";
import Hotels from "./page/hotel/Hotels";
import FlightComingSoon from "./page/flight/flightcomingsoon";
import Destinations from "./page/destination/Destinations";

import AdminLayout from "./page/admin/AdminLayout";
import Dashboard from "./page/admin/Dashboard";
import AdminPackages from "./page/admin/Packages";
import AdminHotels from "./page/admin/Hotels";
import AdminDestinations from "./page/admin/Destinations";
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

function AdminPage({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

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
        <Route path="/destinations" element={<Destinations />} />

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
            <AdminPage>
              <Dashboard />
            </AdminPage>
          }
        />

        {/* ADMIN PACKAGES */}
        <Route
          path="/admin/packages"
          element={
            <AdminPage>
              <AdminPackages />
            </AdminPage>
          }
        />

        {/* ADMIN HOTELS */}
        <Route
          path="/admin/hotels"
          element={
            <AdminPage>
              <AdminHotels />
            </AdminPage>
          }
        />

        {/* ADMIN DESTINATIONS */}
        <Route
          path="/admin/destinations"
          element={
            <AdminPage>
              <AdminDestinations />
            </AdminPage>
          }
        />

        {/* ADMIN RESERVATIONS */}
        <Route
          path="/admin/reservations"
          element={
            <AdminPage>
              <Reservations />
            </AdminPage>
          }
        />

        {/* ADMIN CREATE RESERVATION */}
        <Route
          path="/admin/create-reservation"
          element={
            <AdminPage>
              <CreateReservation />
            </AdminPage>
          }
        />

        {/* ADMIN USERS */}
        <Route
          path="/admin/users"
          element={
            <AdminPage>
              <Users />
            </AdminPage>
          }
        />

        <Route
          path="/admin/clients"
          element={
            <AdminPage>
              <Users />
            </AdminPage>
          }
        />

        {/* ADMIN PAYMENTS */}
        <Route
          path="/admin/payments"
          element={
            <AdminPage>
              <Payments />
            </AdminPage>
          }
        />

        {/* ADMIN MESSAGES */}
        <Route
          path="/admin/messages"
          element={
            <AdminPage>
              <Messages />
            </AdminPage>
          }
        />

        {/* ADMIN SUBSCRIBERS */}
        <Route
          path="/admin/subscribers"
          element={
            <AdminPage>
              <Subscribers />
            </AdminPage>
          }
        />

        {/* ADMIN REVIEWS */}
        <Route
          path="/admin/reviews"
          element={
            <AdminPage>
              <AdminReviews />
            </AdminPage>
          }
        />

        {/* ADMIN PROFILE */}
        <Route
          path="/admin/profile"
          element={
            <AdminPage>
              <Profile />
            </AdminPage>
          }
        />

        {/* ADMIN SETTINGS */}
        <Route
          path="/admin/settings"
          element={
            <AdminPage>
              <Settings />
            </AdminPage>
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