import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.scss';

// SVG Icons
const BellIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const PersonIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const HistoryIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
        <path d="M3.3 7a9 9 0 1 1-1.3 5"></path>
        <polyline points="2 3 2 7 6 7"></polyline>
    </svg>
);

const DollarIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);

const StarIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"></path>
    </svg>
);

const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);


export default function Profile() {
    const navigate = useNavigate();

    const menuItems = [
        { icon: <PersonIcon />, label: 'My Account', path: '/dashboard/profile/my-account' },
        { icon: <PersonIcon />, label: 'Manage Character Profiles', path: '/dashboard/profile/manage-profiles' },
        { icon: <CalendarIcon />, label: 'Manage Booking Availability', path: '/dashboard/profile/availability' },
        { icon: <HistoryIcon />, label: 'Booking History', path: '/dashboard/profile/history' },
        { icon: <DollarIcon />, label: 'My Earnings', path: '/dashboard/profile/earnings' },
        { icon: <SettingsIcon />, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <div className="profile-container">
            <header className="profile-header">
                <div className="top-actions">
                    <button className="notify-btn" onClick={() => navigate('/dashboard/notifications')}>
                        <BellIcon />
                        <span className="badge"></span>
                    </button>
                </div>
                
                <div className="user-info">
                    <div className="avatar-box">
                        <PersonIcon />
                    </div>
                    <div className="name-and-stars">
                        <h2>Test 1</h2>
                        <div className="star-row">
                            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                            <span>0.0</span>
                        </div>
                    </div>
                </div>
                
            </header>

            <div className="menu-card">
                <div className="menu-list">
                    <button 
                        className="menu-item" 
                        onClick={() => navigate('/dashboard/profile/ratings-reviews')}
                    >
                        <span className="icon-wrap"><StarIcon /></span>
                        <span className="label">Ratings & Reviews</span>
                        <span className="arrow"><ArrowIcon /></span>
                    </button>
                    {menuItems.map((item, index) => (
                        <button 
                            key={index}
                            className="menu-item" 
                            onClick={() => item.path !== '#' && navigate(item.path)}
                        >
                            <span className="icon-wrap">{item.icon}</span>
                            <span className="label">{item.label}</span>
                            <span className="arrow">
                                <ArrowIcon />
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
