import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.scss';
import Header from '../../../components/layout/Header/Header';
import { notificationApi } from '../../../api/notificationApi';

const formatNotificationDate = (timestamp) => {
    const notifDate = new Date(timestamp * 1000);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (notifDate.toDateString() === today.toDateString()) {
        return "Today";
    }

    if (notifDate.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return notifDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });
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

            // Fetch Notification List and Count in parallel
            const [listResponse, countResponse] = await Promise.all([
                notificationApi.getNotificationList(0),
                notificationApi.getNotificationCount()
            ]);

            console.log("Notification List:", listResponse?.data);
            console.log("Notification Count:", countResponse?.data);

            if (listResponse?.data?.responseData) {
                setNotifications(listResponse.data.responseData);
            } else {
                setNotifications([]);
            }

            if (countResponse?.data?.responseData?.notificationCount !== undefined) {
                setNotificationCount(countResponse.data.responseData.notificationCount);
            }

        } catch (err) {
            console.error('Notification API Error:', err);
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotificationClick = async (notification) => {
        // If it's unread
        if (notification.eRead === 'No' || notification.eRead === false || notification.isRead === false || !notification.isRead || notification.eRead === "0" || notification.eRead === 0) {
            try {
                const notifId = notification.iNotificationId || notification.id;

                if (notifId) {
                    await notificationApi.updateNotificationReadFlag(notifId);

                    // Optimistically update local state to reflect read status
                    setNotifications(prevNotifs =>
                        prevNotifs.map(n =>
                            (n.iNotificationId === notifId || n.id === notifId)
                                ? { ...n, eRead: 'Yes', isRead: true }
                                : n
                        )
                    );

                    // Decrease notification count if applicable
                    setNotificationCount(prev => Math.max(0, prev - 1));
                }
            } catch (err) {
                console.error('Notification API Error:', err);
            }
        }
    };

    return (
        <div className="notifications-container">
            <Header title={
                <span>
                    Notifications
                    {/* {notificationCount > 0 && (
                        <span className="notification-count" style={{ marginLeft: '8px', fontSize: '1rem', background: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '50%' }}>
                            {notificationCount}
                        </span>
                    )} */}
                </span>
            } />

            <div className="notifications-content">
                {loading ? (
                    <div className="notification-loading">Loading notifications...</div>
                ) : error ? (
                    <div className="notification-error">{error}</div>
                ) : notifications && notifications.length > 0 ? (
                    notifications.map((notif, index) => {
                        const isUnread = notif.eRead === 'No' || notif.eRead === false || notif.isRead === false || !notif.isRead || notif.eRead === "0" || notif.eRead === 0;
                        const title = notif.vMessageTitle || notif.vTitle || notif.title || '';
                        const desc = notif.txMessage || notif.message || notif.description || '';
                        const time = notif.iCreatedAt ? formatNotificationDate(notif.iCreatedAt) : '';

                        return (
                            <div key={notif.iNotificationId || notif.id || index} style={{ cursor: isUnread ? 'pointer' : 'default' }}>
                                <div className={`notification-item ${isUnread ? 'unread' : ''}`}>
                                    {isUnread && <div className="notification-dot"></div>}
                                    <div className="notification-info">
                                        {title && <h2 className="notification-title">{title}</h2>}
                                        {desc && <p className="notification-desc">{desc}</p>}
                                        {time && <span className="notification-time">{time}</span>}
                                    </div>
                                </div>
                                {index !== notifications.length - 1 && <div className="notification-divider"></div>}
                            </div>
                        );
                    })
                ) : (
                    <div className="notification-empty">No notifications found</div>
                )}
            </div>
        </div>
    );
}
