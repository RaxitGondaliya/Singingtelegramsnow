import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomNav.css';

export default function BottomNav({ activeTab }) {
    const navigate = useNavigate();

    return (
        <div className="bottom-nav">
            <div
                className={`nav-item ${activeTab === 'my-bookings' ? 'active' : ''}`}
                onClick={() => navigate("/dashboard/my-bookings")}
            >
                <span className="icon">🏠</span>
                <span className="label">My Bookings</span>
            </div>
            <div
                className={`nav-item ${activeTab === 'booking-requests' ? 'active' : ''}`}
                onClick={() => navigate("/dashboard/booking-requests")}
            >
                <span className="icon">📄</span>
                <span className="label">Booking Requests</span>
            </div>
            <div
                className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                onClick={() => navigate("/dashboard/messages")}
            >
                <span className="icon">💬</span>
                <span className="label">Messages</span>
            </div>
            <div
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => navigate("/dashboard/profile")}
            >
                <span className="icon">👤</span>
                <span className="label">Profile</span>
            </div>
        </div>
    );
}
