import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { notificationApi } from '../../../api/notificationApi';
import './Notifications.scss';

const formatNotificationDate = (timestamp) => {
    const notifDate = new Date(timestamp * 1000);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (notifDate.toDateString() === today.toDateString()) return "Today";
    if (notifDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return notifDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const [listResponse, countResponse] = await Promise.all([
                notificationApi.getNotificationList(0),
                notificationApi.getNotificationCount()
            ]);
            if (listResponse?.data?.responseData) setNotifications(listResponse.data.responseData);
            if (countResponse?.data?.responseData?.notificationCount !== undefined) {
                setNotificationCount(countResponse.data.responseData.notificationCount);
            }
        } catch (err) {
            console.error('Notification API Error:', err);
            setError('Failed to load notifications');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const handleNotificationClick = async (notif) => {
        const isUnread = notif.eRead === 'No' || notif.eRead === false || notif.isRead === false || !notif.isRead || notif.eRead === "0" || notif.eRead === 0;
        if (isUnread) {
            try {
                const notifId = notif.iNotificationId || notif.id;
                if (notifId) {
                    await notificationApi.updateNotificationReadFlag(notifId);
                    setNotifications(prev => prev.map(n => (n.iNotificationId === notifId || n.id === notifId) ? { ...n, eRead: 'Yes', isRead: true } : n));
                    setNotificationCount(prev => Math.max(0, prev - 1));
                }
            } catch (err) { console.error('Error marking as read:', err); }
        }
    };

    return (
        <div className="notifications-container">
            <Header title="Notifications" onBack={() => navigate(-1)} />

            <div className="notifications-list-wrapper">
                {loading ? (
                    <div className="loading-wrap"><div className="spin" /></div>
                ) : error ? (
                    <div className="error-wrap"><h3>Error</h3><p>{error}</p></div>
                ) : notifications && notifications.length > 0 ? (
                    <ul className="notifications-list">
                        {notifications.map((notif, idx) => {
                            const isUnread = notif.eRead === 'No' || notif.eRead === false || notif.isRead === false || !notif.isRead || notif.eRead === "0" || notif.eRead === 0;
                            const title = notif.vMessageTitle || notif.vTitle || '';
                            const desc = notif.txMessage || notif.message || '';
                            const time = notif.iCreatedAt ? formatNotificationDate(notif.iCreatedAt) : '';

                            return (
                                <li 
                                    key={notif.iNotificationId || notif.id || idx}
                                    className={`notification-item ${isUnread ? 'unread' : 'read'}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    {isUnread && <div className="unread-dot" />}
                                    <div className="content">
                                        {title && <h4>{title}</h4>}
                                        {desc && <p>{desc}</p>}
                                        {time && <span className="time">{time}</span>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="empty-wrap"><h3>No Notifications</h3><p>You're all caught up!</p></div>
                )}
            </div>
        </div>
    );
}
