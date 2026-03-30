import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomNav.scss';

// SVG Icons
const HomeIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const AssignmentIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
);

const PersonIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export default function BottomNav({ activeTab }) {
    const navigate = useNavigate();

    const handleClick = (newValue) => {
        navigate(`/dashboard/${newValue}`);
    };

    return (
        <nav className="bottom-nav-container">
            <button 
                className={`nav-item ${activeTab === 'my-bookings' ? 'active' : ''}`}
                onClick={() => handleClick('my-bookings')}
            >
                <HomeIcon />
                <span>My Bookings</span>
            </button>
            <button 
                className={`nav-item ${activeTab === 'booking-requests' ? 'active' : ''}`}
                onClick={() => handleClick('booking-requests')}
            >
                <AssignmentIcon />
                <span>Booking Requests</span>
            </button>
            <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleClick('profile')}
            >
                <PersonIcon />
                <span>Profile</span>
            </button>
        </nav>
    );
}
