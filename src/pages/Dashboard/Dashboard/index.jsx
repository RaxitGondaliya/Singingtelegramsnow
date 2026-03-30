import { useLocation, Outlet } from "react-router-dom";
import BottomNav from "../../../components/layout/BottomNav/BottomNav";
import './DashboardLayout.scss';

export default function DashboardLayout() {
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
        <div className="dashboard-wrapper">
            <aside className={`nav-wrapper ${shouldHideNav ? 'hidden' : ''}`}>
                <BottomNav activeTab={activeTab} />
            </aside>

            <main className={`main-content ${shouldHideNav ? 'full-screen' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
}
