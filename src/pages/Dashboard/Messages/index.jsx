import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import './Messages.scss';

// SVG Icons
const BellIcon = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const MessageIcon = () => (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export default function Messages() {
    const navigate = useNavigate();

    return (
        <div className="messages-container">
            <header className="messages-header">
                <h1>Messages</h1>
                <button 
                    className="noti-btn" 
                    onClick={() => navigate('/dashboard/notifications')}
                    aria-label="View notifications"
                >
                    <BellIcon />
                    <span className="badge-dot" />
                </button>
            </header>

            <main className="empty-messages">
                <div className="icon-box">
                    <MessageIcon />
                </div>
                <p>No Messages Found</p>
                <span style={{ fontSize: '0.8125rem', color: '#999', marginTop: '4px' }}>Check back later for updates.</span>
            </main>
        </div>
    );
}
