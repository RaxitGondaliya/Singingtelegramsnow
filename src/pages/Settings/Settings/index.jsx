import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { authApi } from '../../../api';
import './Settings.scss';

// SVG Icons
const ChevronRight = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

export default function Settings() {
    const navigate = useNavigate();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [userEmail, setUserEmail] = useState('testing@singing.Com');

    useEffect(() => {
        try {
            const userDataString = localStorage.getItem('userData');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                setUserEmail(userData?.vEmailId || userData?.email || 'N/A');
            }
        } catch (err) { console.error('Failed to parse userData:', err); }
    }, []);

    const handleNavigation = (id) => {
        const routes = {
            'sync': '/dashboard/sync-calendars',
            'password': '/dashboard/change-password',
            'about': '/dashboard/about-us',
            'contact': '/dashboard/contact-us',
            'terms': '/dashboard/terms-and-conditions',
            'privacy': '/dashboard/privacy-policy'
        };
        if (routes[id]) navigate(routes[id]);
    };

    const settingsItems = [
        { id: 'notifications', label: 'Manage Notifications', type: 'toggle', value: notificationsEnabled, onChange: () => setNotificationsEnabled(!notificationsEnabled) },
        { id: 'sync', label: 'Sync Calendars', type: 'link' },
        { id: 'password', label: 'Change Password', type: 'link' },
        { id: 'contact', label: 'Contact Us', type: 'link' },
        { id: 'about', label: 'About Us', type: 'link' },
        { id: 'share', label: 'Share App', type: 'link' },
    ];

    const legalItems = [
        { id: 'terms', label: 'Terms & conditions', type: 'link' },
        { id: 'privacy', label: 'Privacy Policy', type: 'link' },
    ];

    const renderList = (items) => (
        <div className="settings-card">
            <div className="settings-list">
                {items.map((item) => (
                    <div 
                        key={item.id}
                        className="settings-item"
                        onClick={() => item.type === 'link' && handleNavigation(item.id)}
                    >
                        <span className="label">{item.label}</span>
                        <div className="action">
                            {item.type === 'toggle' ? (
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={item.value} onChange={item.onChange} />
                                    <span className="slider"></span>
                                </label>
                            ) : (
                                <ChevronRight />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="settings-container">
            <Header title="Settings" onBack={() => navigate(-1)} />

            <div className="settings-wrapper">
                {renderList(settingsItems)}
                {renderList(legalItems)}

                <button 
                    className="signout-card" 
                    onClick={() => { authApi.logout(); navigate('/Signin'); }}
                >
                    <span className="label">Sign Out</span>
                    <span className="email">{userEmail}</span>
                </button>
            </div>
        </div>
    );
}
