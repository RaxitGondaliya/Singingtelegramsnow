import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

export default function Messages() {
    const navigate = useNavigate();
    return (
        <div className="messages-container">
            <div className="messages-header">
                <h1>Messages</h1>
                <div className="notification-icon" onClick={() => navigate('/dashboard/notifications')}>
                    🔔<span className="dot"></span>
                </div>
            </div>

            <div className="messages-content">
                <p className="no-messages-msg">No Messages Found</p>
            </div>
        </div>
    );
}
