import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingRequests.scss';


export default function BookingRequests() {
    const navigate = useNavigate();
    return (

        <div className="requests-container">
            <div className="requests-header">
                <h1>Bookings Requests</h1>
                <div className="notification-icon" onClick={() => navigate('/dashboard/notifications')}>
                    🔔<span className="dot"></span>
                </div>
            </div>


            <div className="requests-content">
                <p className="no-requests-msg">No booking request found.</p>
            </div>
        </div>
    );
}

