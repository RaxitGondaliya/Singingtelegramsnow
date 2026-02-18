import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import Header from '../../components/Header';
import ToggleSwitch from '../../components/ToggleSwitch';

export default function Settings() {
    const navigate = useNavigate();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

    return (
        <div className="settings-container">
            <Header title="Settings" />

            <div className="settings-content">
                <div className="settings-section">
                    {settingsItems.map((item) => (
                        <div key={item.id} className="settings-item-wrapper">
                            <div
                                className="settings-item"
                                onClick={() => {
                                    if (item.type === 'link') {
                                        if (item.id === 'sync') navigate('/dashboard/sync-calendars');
                                        if (item.id === 'password') navigate('/dashboard/change-password');
                                        if (item.id === 'about') navigate('/dashboard/about-us');
                                        if (item.id === 'contact') navigate('/dashboard/contact-us');
                                    }
                                }}
                            >
                                <span className="settings-item-label">{item.label}</span>
                                {item.type === 'toggle' ? (
                                    <ToggleSwitch
                                        active={item.value}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            item.onChange();
                                        }}
                                    />
                                ) : (
                                    <span className="chevron">›</span>
                                )}
                            </div>
                            <div className="settings-divider" />
                        </div>
                    ))}
                </div>

                <div className="section-spacer" />

                <div className="settings-section">
                    {legalItems.map((item) => (
                        <div key={item.id} className="settings-item-wrapper">
                            <div
                                className="settings-item"
                                onClick={() => {
                                    if (item.id === 'privacy') navigate('/dashboard/privacy-policy');
                                    if (item.id === 'terms') navigate('/dashboard/terms-and-conditions');
                                }}
                            >
                                <span className="settings-item-label">{item.label}</span>
                                <span className="chevron">›</span>
                            </div>
                            <div className="settings-divider" />
                        </div>
                    ))}
                </div>

                <div className="section-spacer" />

                <div className="settings-section sign-out-section">
                    <div className="settings-item sign-out-item">
                        <div className="sign-out-info">
                            <span className="sign-out-label">Sign Out</span>
                            <p className="user-email">testing@singing.Com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
