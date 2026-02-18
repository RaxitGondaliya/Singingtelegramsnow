import React from 'react';
import Header from '../../components/Header';
import './BookingHistory.css';

const BookingCard = ({ booking }) => {
    return (
        <div className="booking-card">
            <div className="date-badge">
                <span className="date-day">{booking.day}</span>
                <span className="date-month">{booking.month}</span>
            </div>

            <div className="card-content">
                {/* User Info */}
                <div className="user-info">
                    <div className="user-avatar">
                        <i className="fa-regular fa-user"></i> {/* FontAwesome icon */}
                    </div>
                    <span className="user-name">{booking.userName}</span>
                </div>

                {/* Character Details Section */}
                <div className="character-section">
                    <div className="char-image-container">
                        <img src={booking.charImage} alt="Character" className="char-thumbnail" />
                    </div>
                    <div className="char-details">
                        <h3 className="char-name">{booking.charName}</h3>
                        <div className="detail-row">
                            <span className="icon">🕒</span>
                            <span>{booking.time}</span>
                        </div>
                        <div className="detail-row">
                            <span className="icon">📍</span>
                            <span className="location-text">{booking.location}</span>
                        </div>
                    </div>
                </div>

                <div className="card-footer">
                    <div className="status-container">
                        <span className="status-label">Status:</span>
                        <span className={`status-value ${booking.status.toLowerCase()}`}>
                            {booking.status}
                        </span>
                    </div>
                    <button className="menu-dot-btn">⋮</button>
                </div>
            </div>
        </div>
    );
};

export default function BookingHistory() {
    // Dummy data
    const bookings = [
        {
            id: 1,
            day: '23',
            month: 'Oct',
            userName: 'Anita Volz',
            charName: 'Austin Powers',
            time: '04:00 PM - 05:00 PM',
            location: '250 Howard Street, San Francisco, CA, USA',
            status: 'Completed',
            charImage: 'https://via.placeholder.com/60'
        },
        {
            id: 2,
            day: '26',
            month: 'Aug',
            userName: 'Anita Volz',
            charName: 'Austin Powers',
            time: '12:00 PM - 01:00 PM',
            location: 'San Francisco, CA, USA',
            status: 'Completed',
            charImage: 'https://via.placeholder.com/60'
        }
    ];

    return (
        <div className="booking-history-container">
            <Header title="Booking History" />

            <div className="booking-list">
                {bookings.map(item => (
                    <BookingCard key={item.id} booking={item} />
                ))}
            </div>
        </div>
    );
}