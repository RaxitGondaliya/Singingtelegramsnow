import { useNavigate, useLocation, Outlet } from "react-router-dom";
import './Dashboard.scss';
import { useEffect } from "react";
import BottomNav from "../../../components/layout/BottomNav/BottomNav";


export default function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab based on current path
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes("/my-bookings")) return "my-bookings";
        if (path.includes("/booking-requests")) return "booking-requests";
        if (path.includes("/messages")) return "messages";
        if (path.includes("/profile")) return "profile";
        return "my-bookings"; // Default
    };

    const path = location.pathname.toLowerCase();
    const isNotificationsPage = path.includes("notifications");
    const isSettingsPage = path.includes("setting") || path.includes("sync-calendars") || path.includes("change-password") || path.includes("about-us") || path.includes("privacy-policy") || path.includes("contact-us") || (path.includes("profile/") && !path.endsWith("profile"));

    const activeTab = getActiveTab();
    const shouldHideNav = isNotificationsPage || isSettingsPage;

    return (
        <div className={`dashboard-container ${shouldHideNav ? 'hide-nav' : ''}`}>
            {/* Main Content Area (Outlet renders the child route) */}
            <div className="dashboard-content">
                <Outlet />
            </div>

            {/* Bottom Navigation / Sidebar */}
            <BottomNav activeTab={activeTab} />
        </div>
    );
}


