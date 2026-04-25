import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.scss';
import Header from '../../../components/layout/Header/Header';
import ToggleSwitch from '../../../components/common/ToggleSwitch/ToggleSwitch';
import { authApi, notificationApi } from '../../../api';
import { useMessage } from '../../../context/MessageContext';

export default function Settings() {
    const navigate = useNavigate();
    const { showMessage } = useMessage();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [userEmail, setUserEmail] = useState('testing@singing.Com');

    useEffect(() => {
        try {
            const userDataString = localStorage.getItem('userData');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                if (userData && userData.vEmailId) {
                    setUserEmail(userData.vEmailId);
                } else if (userData && userData.email) {
                    setUserEmail(userData.email);
                }
                
                if (userData && typeof userData.tiNotification !== 'undefined') {
                    setNotificationsEnabled(userData.tiNotification === "1" || userData.tiNotification === 1);
                }
            }
        } catch (error) {
            console.error('Failed to parse userData from localStorage:', error);
        }
    }, []);

    const handleNotificationToggle = async () => {
        const newValue = !notificationsEnabled;
        const flagValue = newValue ? "1" : "0";
        setNotificationsEnabled(newValue);
        try {
            const response = await notificationApi.updateNotificationFlag(flagValue);
            
            if (response.data && response.data.responseCode === 200) {
                showMessage(response.data.responseMessage || 'Notification Flag Updated Successfully.', 'success');
                const userDataString = localStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    userData.tiNotification = flagValue;
                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            } else {
                showMessage(response.data?.responseMessage || 'Failed to update notification flag', 'error');
                setNotificationsEnabled(!newValue); // Rollback
            }
        } catch (error) {
            console.error('Failed to update notification flag:', error);
            showMessage(error.response?.data?.responseMessage || 'Failed to update notification flag', 'error');
            setNotificationsEnabled(!newValue); // Rollback
        }
    };

    const settingsItems = [
        { id: 'notifications', label: 'Manage Notifications', type: 'toggle', value: notificationsEnabled, onChange: handleNotificationToggle },
        { id: 'sync', label: 'Sync Calendars', type: 'link' },
        { id: 'password', label: 'Change Password', type: 'link' },
        { id: 'contact', label: 'Contact Us', type: 'link' },
        { id: 'about', label: 'About Us', type: 'link' },
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
                    <div
                        className="settings-item sign-out-item"
                        onClick={() => {
                            authApi.logout();
                            navigate('/Signin');
                        }}
                    >
                        <div className="sign-out-info">
                            <span className="sign-out-label">Sign Out</span>
                            <p className="user-email">{userEmail}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
