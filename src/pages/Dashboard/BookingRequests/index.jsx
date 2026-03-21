import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../../api/bookingApi';
import { useMessage } from '../../../context/MessageContext';
import './BookingRequests.scss';

export default function BookingRequests() {
    const navigate = useNavigate();
    const { showConfirm } = useMessage();

    const [bookingRequests, setBookingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const response = await bookingApi.getBookingRequests();

                let data = [];
                if (response.data && Array.isArray(response.data.responseData)) {
                    data = response.data.responseData;
                } else if (response.data && response.data.status === 200) {
                    data = response.data.data || [];
                } else if (response.data && Array.isArray(response.data.data)) {
                    data = response.data.data;
                } else if (Array.isArray(response.data)) {
                    data = response.data;
                }

                setBookingRequests(data);
            } catch (error) {
                console.error('Error fetching booking requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const formatRequest = (req) => {
        // Fallback formatting in case the backend uses different property names
        let dateObj = new Date();
        const bookingDateStr = req.dBookingDate || req.date;
        if (bookingDateStr) {
            dateObj = new Date(bookingDateStr);
        }

        return {
            id: req.id || req.iBookingId || Math.random(),
            date: req.date || dateObj.getDate().toString(),
            month: req.month || dateObj.toLocaleString('default', { month: 'short' }),
            userName: req.vUserName || req.userName || `${req.vFirstName || ''} ${req.vLastName || ''}`.trim() || 'Unknown User',
            characterImg: req.vImage || req.txProfilePic || req.characterImg || req.txCharacterPic || req.vCharacterImage || 'https://via.placeholder.com/60?text=Image',
            characterName: req.vCharacterName || req.characterName || 'Unknown Character',
            time: (req.tFromTime && req.tToTime) ? `${req.tFromTime} - ${req.tToTime}` : (req.time || req.vBookingTime || `${req.vStartTime || '00:00'} - ${req.vEndTime || '00:00'}`),
            location: req.vStreetAddress || req.location || req.vAddress || req.vLocation || 'Unknown Location',
            ...req
        };
    };

    if (loading) {
        return (
            <div className="requests-container">
                <div className="requests-header">
                    <h1>Bookings Requests</h1>
                </div>
                <div className="requests-content" style={{ padding: '20px' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div className="requests-container">
            <div className="requests-header">
                <h1>Bookings Requests</h1>
                <div className="notification-icon" onClick={() => navigate('/dashboard/notifications')}>
                    🔔<span className="dot"></span>
                </div>
            </div>

            <div className="requests-content">
                {bookingRequests.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', width: '100%' }}>No booking requests found.</div>
                ) : (
                    bookingRequests.map((rawReq, index) => {
                        const request = formatRequest(rawReq);
                        return (
                            <div
                                className="booking-card"
                                key={request.id || index}
                                onClick={() => {
                                    if (request.iBookingId || request.id) {
                                        navigate(`/dashboard/profile/history/${request.iBookingId || request.id}`);
                                    }
                                }}
                            >
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

                                <div className="card-actions">
                                    <button
                                        className="btn-decline"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            const confirmed = await showConfirm('Are you sure you want to cancel this booking?');
                                            if (confirmed) {
                                                navigate('/dashboard/profile/cancel-policy', { 
                                                    state: { bookingId: request.iBookingId } 
                                                });
                                            }
                                        }}
                                    >
                                        Decline
                                    </button>
                                    <button
                                        className="btn-confirm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            bookingApi.confirmBooking(request.iBookingId);
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
