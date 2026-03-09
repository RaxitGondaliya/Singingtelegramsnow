import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { bookingApi } from '../../../api/bookingApi';
import './BookingHistory.scss';

const BookingCard = ({ booking, activeMenu, setActiveMenu }) => {
    const isMenuOpen = activeMenu === booking.id;
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // 1. New Handler: Navigates to the Details page
    const handleCardClick = () => {
        // This will open the details page when clicking anywhere on the card
        navigate(`/dashboard/profile/history/${booking.id}`);
    };

    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation(); // 2. IMPORTANT: Prevents the card click from firing when opening dots
        setActiveMenu(isMenuOpen ? null : booking.id);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenu(null);
            }
        };
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen, setActiveMenu]);

    const handleReportRedirect = (e) => {
        e.stopPropagation(); // 3. Prevents navigating to details when clicking Report
        setActiveMenu(null);
        localStorage.setItem('reportBookingId', booking.id);
        navigate('/dashboard/profile/report', { state: { iBookingId: booking.id } });
    };

    return (
        /* 4. Added handleCardClick here */
        <div className="booking-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="date-badge">
                <span className="date-day">{booking.day}</span>
                <span className="date-month">{booking.month}</span>
            </div>

            <div className="card-body">
                <div className="user-info-header">
                    <div className="avatar-circle">
                        <i className="fa-regular fa-user"></i>
                    </div>
                    <span className="user-full-name">{booking.userName}</span>
                </div>

                <hr className="divider" />

                <div className="main-content">
                    <div className="img-wrapper">
                        <img src={booking.charImage} alt="" className="booking-img" />
                    </div>

                    <div className="text-details">
                        <h3 className="character-name">{booking.charName}</h3>
                        <div className="detail-row">
                            <span className="icon">🕒</span>
                            <span className="one-line">{booking.time}</span>
                        </div>
                        <div className="detail-row">
                            <span className="icon">📍</span>
                            <span className="one-line">{booking.location}</span>
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                <div className="card-footer">
                    <div className="status-box">
                        <span className="label">Status:</span>
                        <span className={`value ${booking.status.toLowerCase()}`}>
                            {booking.status}
                        </span>
                    </div>

                    {/* 5. Added stopPropagation to the menu container */}
                    <div className="action-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                        <button className="dots-btn" onClick={toggleMenu}>⋮</button>
                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                <button className="dropdown-item" onClick={handleReportRedirect}>
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
    const [activeMenu, setActiveMenu] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await bookingApi.getBookingHistory();
                console.log('Booking history response:', response.data);

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
            3: 'Completed',
            4: 'Cancelled',
            5: 'Reported'
        };

        const timeStr = req.time || req.vBookingTime || (req.tFromTime && req.tToTime ? `${req.tFromTime} - ${req.tToTime}` : null) || `${req.vStartTime || '00:00'} - ${req.vEndTime || '00:00'}`;

        // Use a placeholder URL if vImage is just a filename
        let imageSrc = req.charImage || req.txProfilePic || req.txCharacterPic || req.vCharacterImage;
        if (!imageSrc && req.vImage) {
            imageSrc = `https://placehold.co/100x100?text=${req.vImage.slice(0, 10)}`;
        }
        if (!imageSrc || imageSrc === '') {
            imageSrc = 'https://placehold.co/100x100';
        }

        return {
            id: req.id || req.iBookingId || Math.random(),
            day: req.day || dateObj.getDate().toString().padStart(2, '0'),
            month: req.month || dateObj.toLocaleString('default', { month: 'short' }),
            userName: req.userName || req.vUserName || `${req.vFirstName || ''} ${req.vLastName || ''}`.trim() || 'Unknown User',
            charImage: imageSrc,
            charName: req.charName || req.vCharacterName || 'Unknown Character',
            time: timeStr,
            location: req.location || req.vStreetAddress || req.vAddress || req.vLocation || 'Unknown Location',
            status: req.status || (req.tiStatus ? statusMap[req.tiStatus] : null) || req.eStatus || req.vStatus || 'Completed',
            ...req
        };
    };

    if (loading) {
        return (
            <div className="booking-history-page">
                <Header title="Booking History" />
                <div className="booking-container" style={{ padding: '20px', textAlign: 'center' }}>
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="booking-history-page">
            <Header title="Booking History" />
            <div className="booking-container">
                <div className="booking-list">
                    {bookings.length === 0 ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '20px' }}>No booking history found.</div>
                    ) : (
                        bookings.map((item, index) => {
                            const formattedBooking = formatBooking(item);
                            return (
                                <BookingCard
                                    key={formattedBooking.id || index}
                                    booking={formattedBooking}
                                    activeMenu={activeMenu}
                                    setActiveMenu={setActiveMenu}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
