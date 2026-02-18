import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLanding from "./pages/Auth/AuthLanding";
import Signup from "./pages/Auth/Signup";
import Signin from "./pages/Auth/Signin";
import DashboardLayout from "./pages/Dashboard/Dashboard";
import MyBookings from "./pages/Dashboard/MyBookings";
import BookingRequests from "./pages/Dashboard/BookingRequests";
import Messages from "./pages/Dashboard/Messages";
import Profile from "./pages/Profile/Profile";
import MyAccount from "./pages/Profile/MyAccount";
import ManageProfiles from "./pages/Profile/ManageProfiles";
import Availability from "./pages/Profile/ManageAvailability";
import BookingHistory from "./pages/Profile/BookingHistory";
import MyEarnings from "./pages/Profile/MyEarnings";
import AddCharacterProfile from "./pages/Profile/AddCharacterProfile";
import EditCharacterProfile from "./pages/Profile/EditCharacterProfile";
import Notifications from "./pages/Dashboard/Notifications";
import Settings from "./pages/Settings/Settings";
import SyncCalendars from "./pages/Settings/SyncCalendars";
import ChangePassword from "./pages/Settings/ChangePassword";
import AboutUs from "./pages/Settings/AboutUs";

import PrivacyPolicy from "./pages/Settings/PrivacyPolicy";
import ContactUs from "./pages/Settings/ContactUs";
import TermsAndConditions from "./pages/Settings/TermsAndConditions";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLanding />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/setting" element={<Settings />} />
        <Route path="/sync-calendars" element={<SyncCalendars />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />


        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="my-bookings" replace />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="booking-requests" element={<BookingRequests />} />
          <Route path="messages" element={<Messages />} />

          {/* Profile Group */}
          <Route path="profile">
            <Route index element={<Profile />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="manage-profiles" element={<ManageProfiles />} />
            <Route path="availability" element={<Availability />} />
            <Route path="history" element={<BookingHistory />} />
            <Route path="earnings" element={<MyEarnings />} />
            <Route path="add-character" element={<AddCharacterProfile />} />
            <Route path="edit-character" element={<EditCharacterProfile />} />
          </Route>

          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="setting" element={<Settings />} />
          <Route path="sync-calendars" element={<SyncCalendars />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
