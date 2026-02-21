import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.scss';
import ProfileMenuItem from '../../../components/common/ProfileMenuItem/ProfileMenuItem';

export default function Profile() {
    const navigate = useNavigate();

    const menuItems = [
        { icon: '👤', label: 'My Account', path: '/dashboard/profile/my-account' },
        { icon: '👤', label: 'Manage Character Profiles', path: '/dashboard/profile/manage-profiles' },
        { icon: '📅', label: 'Manage Booking Availability', path: '/dashboard/profile/availability' },
        { icon: '📄', label: 'Booking History', path: '/dashboard/profile/history' },
        { icon: '💰', label: 'My Earnings', path: '/dashboard/profile/earnings' },
        { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
    ];


    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="notification-bell">🔔</div>
                <div className="profile-main-content">
                    <div className="profile-avatar-container">
                        <span className="avatar-icon">👤</span>
                    </div>
                    <div className="profile-info">
                        <h2 className="profile-name">Test 1</h2>
                        <div className="profile-rating">
                            <span>⭐⭐⭐⭐⭐</span>
                            <span className="rating-value">0.0</span>
                        </div>
                    </div>
                </div>
                <a href="#" className="ratings-reviews-link">
                    Ratings & Reviews <span>→</span>
                </a>
            </div>

            <div className="profile-menu">
                {menuItems.map((item, index) => (
                    <ProfileMenuItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        onClick={() => item.path !== '#' && navigate(item.path)}
                    />
                ))}
            </div>
        </div>
    );
}
