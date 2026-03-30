import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../../api/bookingApi';
import { useMessage } from '../../../context/MessageContext';
import { getImageUrl } from '../../../utils/imageUtils';
import './BookingRequests.scss';

// SVG Icons
const BellIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const PersonIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const ClockIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const LocationIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

export default function BookingRequests() {
    const navigate = useNavigate();
    const { showConfirm, showMessage } = useMessage();
    const [bookingRequests, setBookingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await bookingApi.getBookingRequests();
            let data = response.data?.responseData || response.data?.data || response.data || [];
            if (!Array.isArray(data)) data = [];
            setBookingRequests(data);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const formatRequest = (req) => {
        let dateObj = new Date();
        const bookingDateStr = req.dBookingDate || req.date;
        if (bookingDateStr) dateObj = new Date(bookingDateStr);
        return {
            ...req,
            id: req.id || req.iBookingId || Math.random(),
            date: (req.date || req.day || dateObj.getDate().toString()).padStart(2, '0'),
            month: req.month || dateObj.toLocaleString('default', { month: 'short' }),
            userName: req.vUserName || req.userName || 'Unknown User',
            characterImg: getImageUrl(req.vImage || req.txProfilePic || req.characterImg),
            characterName: req.vCharacterName || req.characterName || 'Unknown Character',
            time: (req.tFromTime && req.tToTime) ? `${req.tFromTime} - ${req.tToTime}` : (req.time || req.vBookingTime),
            location: req.vStreetAddress || req.location || req.vAddress || 'Unknown Location'
        };
    };

    const handleConfirm = async (e, request) => {
        e.stopPropagation();
        try {
            const res = await bookingApi.confirmBooking(request.iBookingId);
            if (res.data?.responseCode === 200 || res.data?.status === 200) {
                showMessage('Booking confirmed successfully!', 'success');
                fetchRequests();
            } else {
                showMessage(res.data?.responseMessage || 'Failed to confirm', 'error');
            }
        } catch (error) {
            console.error('Error confirming booking', error);
            showMessage('Error confirming booking', 'error');
        }
    };

    const handleDecline = async (e, request) => {
        e.stopPropagation();
        const confirmed = await showConfirm('Are you sure you want to decline this booking?');
        if (confirmed) {
            navigate('/dashboard/cancellation-policy', { state: { bookingId: request.iBookingId } });
        }
    };

    return (
        <div className="booking-requests-container">
            <header className="requests-header">
                <h1>Booking Requests</h1>
                <button className="notify-btn" onClick={() => navigate('/dashboard/notifications')}>
                    <BellIcon />
                    <span className="badge" />
                </button>
            </header>

            <main className="list-container">
                {loading ? (
                    <div className="loading-wrap">
                        <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: '#e14b3b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : bookingRequests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No booking requests found.</div>
                ) : (
                    <div className="requests-grid">
                        {bookingRequests.map((rawReq, index) => {
                            const request = formatRequest(rawReq);
                            return (
                                <div key={request.id || index} className="request-card" onClick={() => navigate(`/dashboard/profile/history/${request.iBookingId || request.id}`)}>
                                    <div className="date-badge">
                                        <span className="day">{request.date}</span>
                                        <span className="month">{request.month}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="header-info">
                                            <div className="avatar"><PersonIcon /></div>
                                            <span className="name">{request.userName}</span>
                                        </div>
                                        <div className="divider" style={{ margin: '8px 0 12px', height: '1px', backgroundColor: '#eee' }} />
                                        <div className="content-box">
                                            <img src={request.characterImg} alt="" />
                                            <div className="details">
                                                <h4>{request.characterName}</h4>
                                                <div className="info"><ClockIcon /><span>{request.time}</span></div>
                                                <div className="info"><LocationIcon /><span>{request.location}</span></div>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="status-chip">Requested</div>
                                            <div className="action-btns">
                                                <button className="btn btn-outline-error" onClick={e => handleDecline(e, request)}>Decline</button>
                                                <button className="btn btn-primary" onClick={e => handleConfirm(e, request)}>Confirm</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
