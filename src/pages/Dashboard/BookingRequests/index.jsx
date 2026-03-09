import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingRequests.scss';

export default function BookingRequests() {
    const navigate = useNavigate();

    // Sample data to match the image
    const bookingRequests = [
        {
            date: '13',
            month: 'Mar',
            userName: 'Anita Volz',
            characterImg: 'https://via.placeholder.com/60?text=Image',
            characterName: 'Testing Character',
            time: '02:00 PM - 03:00 PM',
            location: 'Colma, CA, USA',
        },
        {
            date: '14',
            month: 'Mar',
            userName: 'John Smith',
            characterImg: 'https://via.placeholder.com/60?text=Image',
            characterName: 'Super Hero',
            time: '04:00 PM - 05:00 PM',
            location: 'New York, USA',
        },
        {
            date: '15',
            month: 'Mar',
            userName: 'Emily Watson',
            characterImg: 'https://via.placeholder.com/60?text=Image',
            characterName: 'Princess Character',
            time: '06:00 PM - 07:00 PM',
            location: 'Los Angeles, USA',
        }
    ];

    return (
        <div className="requests-container">
            <div className="requests-header">
                <h1>Bookings Requests</h1>
                <div className="notification-icon" onClick={() => navigate('/dashboard/notifications')}>
                    🔔<span className="dot"></span>
                </div>
            </div>

            <div className="requests-content">
                {bookingRequests.map((request, index) => (
                    <div className="booking-card" key={index}>
                        <div className="date-badge">
                            <span className="day">{request.date}</span>
                            <span className="month">{request.month}</span>
                        </div>

                        <div className="card-header-info">
                            <div className="user-avatar-placeholder">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <span className="user-name">{request.userName}</span>
                        </div>

                        <div className="divider"></div>

                        <div className="card-details">
                            <div className="character-image-wrapper">
                                <img src={request.characterImg} alt="Character" className="character-image" />
                            </div>
                            <div className="details-text">
                                <h3 className="character-name">{request.characterName}</h3>
                                <div className="info-row">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <span>{request.time}</span>
                                </div>
                                <div className="info-row">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span>{request.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="card-actions">
                            <button className="btn-decline">Decline</button>
                            <button className="btn-confirm">Confirm</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
