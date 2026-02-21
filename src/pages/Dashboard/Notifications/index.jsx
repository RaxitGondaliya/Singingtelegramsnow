import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.scss';
import Header from '../../../components/layout/Header/Header';

export default function Notifications() {
    const navigate = useNavigate();

    const notifications = [
        {
            id: 1,
            title: "Next 14 Days Availability Reminder",
            description: "Please add availability for future dates on your STN calendar.",
            time: "Today"
        },
        {
            id: 2,
            title: "Next 14 Days Availability Reminder",
            description: "Please add availability for future dates on your STN calendar.",
            time: "Yesterday"
        },
        {
            id: 3,
            title: "Next 14 Days Availability Reminder",
            description: "Please add availability for future dates on your STN calendar.",
            time: "January 16, 2026"
        }
    ];

    return (
        <div className="notifications-container">
            <Header title="Notifications" />

            <div className="notifications-content">
                {notifications.map((notif, index) => (
                    <div key={notif.id}>
                        <div className="notification-item">
                            <div className="notification-dot"></div>
                            <div className="notification-info">
                                <h2 className="notification-title">{notif.title}</h2>
                                <p className="notification-desc">{notif.description}</p>
                                <span className="notification-time">{notif.time}</span>
                            </div>
                        </div>
                        {index !== notifications.length - 1 && <div className="notification-divider"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
