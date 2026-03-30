import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { bookingApi } from '../../../api/bookingApi';
import { getImageUrl } from '../../../utils/imageUtils';
import { useMessage } from '../../../context/MessageContext';
import './BookingHistory.scss';

// SVG Icons
const PersonIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const ClockIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const MapPinIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const MoreIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="12" cy="5" r="1"></circle>
        <circle cx="12" cy="19" r="1"></circle>
    </svg>
);

const BookingCard = ({ booking, onRefresh }) => {
    const navigate = useNavigate();
    const { showMessage, showConfirm } = useMessage();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCardClick = () => {
        navigate(`/dashboard/profile/history/${booking.id}`);
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleReportRedirect = (e) => {
        e.stopPropagation();
        setShowMenu(false);
        localStorage.setItem('reportBookingId', booking.id);
        navigate('/dashboard/profile/report', { state: { iBookingId: booking.id } });
    };

    const handleMarkAsCompleted = async (e) => {
        e.stopPropagation();
        setShowMenu(false);

        const confirmed = await showConfirm('Are you sure you want to mark this booking as completed?');
        if (!confirmed) return;

        try {
            const response = await bookingApi.completeBooking(booking.id);
            const data = response.data || {};

            const isSuccess = (data.responseCode === 200 || data.responseCode === '200' ||
                data.status === 200 || data.status === '200' || data.status === 1 || data.status === '1') ||
                (!data.responseCode && !data.status && response.status === 200);

            if (isSuccess) {
                showMessage(data.responseMessage || data.message || 'Booking marked as completed successfully!', 'success');
                if (onRefresh) onRefresh();
            } else {
                showMessage(data.responseMessage || data.message || 'Failed to complete booking', 'error');
            }
        } catch (error) {
            console.error('Error completing booking:', error);
            showMessage('An error occurred while completing the booking.', 'error');
        }
    };

    const getStatusClass = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('pending')) return 'pending';
        if (s.includes('confirm')) return 'confirmed';
        if (s.includes('complete')) return 'completed';
        if (s.includes('cancel') || s.includes('decline')) return 'error';
        return '';
    };

    return (
        <div className="booking-card" onClick={handleCardClick}>
            <div className="date-badge">
                <span className="day">{booking.day}</span>
                <span className="month">{booking.month}</span>
            </div>

            <div className="card-content">
                <div className="card-header">
                    <div className="avatar">
                        <PersonIcon />
                    </div>
                    <span className="user-name">{booking.userName}</span>
                </div>

                <div className="divider" />

                <div className="char-info-box">
                    <img className="char-img" src={booking.charImage} alt="" />
                    <div className="char-details">
                        <h6>{booking.charName}</h6>

                        <div className="info-row">
                            <ClockIcon />
                            <span>{booking.time}</span>
                        </div>

                        <div className="info-row">
                            <MapPinIcon />
                            <span>{booking.location}</span>
                        </div>
                    </div>
                </div>

                <div className="divider" />

                <div className="card-footer">
                    <div className="status-box">
                        <span>Status:</span>
                        <div className={`chip ${getStatusClass(booking.status)}`}>
                            {booking.status}
                        </div>
                    </div>

                    <div style={{ position: 'relative' }} ref={menuRef}>
                        <button className="more-btn" onClick={toggleMenu}>
                            <MoreIcon />
                        </button>
                        {showMenu && (
                            <div className="custom-menu">
                                {(booking.status === 'Confirm' || booking.status === 'Confirmed') && (
                                    <button className="menu-item" onClick={handleMarkAsCompleted}>
                                        Mark as Completed
                                    </button>
                                )}
                                <button className="menu-item" onClick={handleReportRedirect}>
                                    Report It
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function BookingHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await bookingApi.getBookingHistory();

            let data = [];
            if (response.data && response.data.responseData) {
                data = response.data.responseData;
            } else if (response.data && response.data.status === 200) {
                data = response.data.data || [];
            } else if (response.data && Array.isArray(response.data.data)) {
                data = response.data.data;
            } else if (Array.isArray(response.data)) {
                data = response.data;
            }

            setBookings(data);
        } catch (error) {
            console.error('Error fetching booking history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const formatBooking = (req) => {
        let dateObj = new Date();
        const bookingDateStr = req.dBookingDate || req.date;
        if (bookingDateStr) {
            dateObj = new Date(bookingDateStr);
        }

        const statusMap = {
            1: 'Pending',
            2: 'Confirmed',
            3: 'Declined',
            4: 'Completed',
            5: 'Cancelled by Entertainer'
        };

        const timeStr = req.time || req.vBookingTime || (req.tFromTime && req.tToTime ? `${req.tFromTime} - ${req.tToTime}` : null) || `${req.vStartTime || '00:00'} - ${req.vEndTime || '00:00'}`;

        return {
            ...req,
            id: req.id || req.iBookingId || Math.random(),
            day: (req.day || dateObj.getDate().toString()).padStart(2, '0'),
            month: req.month || dateObj.toLocaleString('default', { month: 'short' }),
            userName: req.userName || req.vUserName || `${req.vFirstName || ''} ${req.vLastName || ''}`.trim() || 'Unknown User',
            charImage: getImageUrl(req.charImage || req.txProfilePic || req.txCharacterPic || req.vCharacterImage || req.vImage),
            charName: req.charName || req.vCharacterName || 'Unknown Character',
            time: timeStr,
            location: req.location || req.vStreetAddress || req.vAddress || req.vLocation || 'Unknown Location',
            status: req.status || (req.tiStatus ? statusMap[req.tiStatus] : null) || req.eStatus || req.vStatus || 'Completed'
        };
    };

    if (loading) {
        return (
            <div className="booking-history-container">
                <Header title="Booking History" />
                <div className="loading-container">
                    <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: '#e14b3b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-history-container">
            <Header title="Booking History" />
            <div className="bookings-grid-wrapper" style={{ marginTop: '2rem' }}>
                {bookings.length === 0 ? (
                    <div className="no-history">
                        <p>No booking history found.</p>
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {bookings.map((item, index) => {
                            const formattedBooking = formatBooking(item);
                            return (
                                <BookingCard
                                    key={formattedBooking.id || index}
                                    booking={formattedBooking}
                                    onRefresh={fetchHistory}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
