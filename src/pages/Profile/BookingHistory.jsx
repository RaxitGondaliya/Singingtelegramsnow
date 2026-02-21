import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './BookingHistory.css';

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
        navigate('/dashboard/profile/report'); 
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

    const bookings = [
        { id: 1, day: '23', month: 'Oct', userName: 'Anita Volz', charName: 'Austin Powers', time: '04:00 PM - 05:00 PM', location: '250 Howard Street, San Francisco, CA, USA', status: 'Completed', charImage: 'https://placehold.co/100x100' },
        { id: 2, day: '26', month: 'Aug', userName: 'Anita Volz', charName: 'Austin Powers', time: '12:00 PM - 01:00 PM', location: 'San Francisco, CA, USA', status: 'Completed', charImage: 'https://placehold.co/100x100' },
        { id: 3, day: '05', month: 'Oct', userName: 'Anita Volz', charName: 'Austin Powers', time: '12:00 PM - 01:00 PM', location: 'San Francisco, CA, USA', status: 'Confirmed', charImage: 'https://placehold.co/100x100' },
    ];

    return (
        <div className="booking-history-page">
            <Header title="Booking History" />
            <div className="booking-container">
                <div className="booking-list">
                    {bookings.map(item => (
                        <BookingCard
                            key={item.id}
                            booking={item}
                            activeMenu={activeMenu}
                            setActiveMenu={setActiveMenu}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}