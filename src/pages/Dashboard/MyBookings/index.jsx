import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../../api';
import { getImageUrl } from '../../../utils/imageUtils';
import { useMessage } from '../../../context/MessageContext';
import './MyBookings.scss';


export default function MyBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [bookingDates, setBookingDates] = useState([]); // List of dates that have bookings
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelComment, setCancelComment] = useState('');
    const [reasonsList, setReasonsList] = useState([]);
    const [submittingCancel, setSubmittingCancel] = useState(false);
    const menuRef = useRef(null);
    const { showMessage, showAlert, showConfirm } = useMessage();

    // Minimum swipe distance in pixels
    const minSwipeDistance = 50;

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    useEffect(() => {
        fetchBookings();
    }, [selectedDate]);

    useEffect(() => {
        fetchBookingHighlights();
    }, [currentDate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const formattedDate = formatDate(selectedDate);
            const response = await bookingApi.getMyBookings(formattedDate);

            let data = [];
            if (response.data && response.data.responseData) {
                data = response.data.responseData;
            } else if (response.data && Array.isArray(response.data.data)) {
                data = response.data.data;
            } else if (Array.isArray(response.data)) {
                data = response.data;
            }

            setBookings(data);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookingHighlights = async () => {
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const response = await bookingApi.getMyBookingDates(month, year);

            let highlightedDates = [];

            if (response.data && Array.isArray(response.data.responseData)) {
                // The API returns an array of objects like { dBookingDate: "2026-03-22", tiIsAvailabile: 1 }
                highlightedDates = response.data.responseData
                    .filter(item => item.tiIsAvailabile === 1 || item.tiIsAvailabile === '1')
                    .map(item => item.dBookingDate);
            }

            setBookingDates(highlightedDates);
        } catch (err) {
            console.error("Failed to fetch booking highlights", err);
        }
    };


    // Helper to get days in a month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper to get day of week for first day (0 = Sun, 6 = Sat)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month); // 0-6
        const daysInPrevMonth = getDaysInMonth(year, month - 1);

        const daysArray = [];

        // Previous month padding (Empty slots)
        for (let i = 0; i < firstDay; i++) {
            daysArray.push({
                date: null, // Empty slot
                currentMonth: false,
                fullDate: new Date(year, month - 1, daysInPrevMonth - firstDay + 1 + i)
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push({
                date: i,
                currentMonth: true,
                fullDate: new Date(year, month, i)
            });
        }

        // Next month padding (Empty slots)
        const remainingCells = 42 - daysArray.length;
        for (let i = 1; i <= remainingCells; i++) {
            daysArray.push({
                date: null, // Empty slot
                currentMonth: false,
                fullDate: new Date(year, month + 1, i)
            });
        }


        return daysArray;
    };

    const handlePrevMonth = () => {
        setSlideDirection('slide-right');
        setTimeout(() => {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
            setSlideDirection('');
        }, 300);
    };

    const handleNextMonth = () => {
        setSlideDirection('slide-left');
        setTimeout(() => {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
            setSlideDirection('');
        }, 300);
    };

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNextMonth();
        } else if (isRightSwipe) {
            handlePrevMonth();
        }
    };


    const handleDateClick = (day) => {
        setSelectedDate(day.fullDate);
        if (!day.currentMonth) {
            // Optional: switching month on clicking grey dates
            setCurrentDate(new Date(day.fullDate.getFullYear(), day.fullDate.getMonth(), 1));
        }
    };

    const togglePicker = () => {
        // Only open on mobile/tablet if needed, or check width? 
        // User asked for arrows on desktop/tab, popup on mobile.
        // We can check window width or just control via CSS (pointer-events).
        // For logic simplicity, we'll allow it to open but CSS will hide/show triggers.
        if (window.innerWidth <= 768) {
            setIsPickerOpen(true);
        }
    };

    const selectMonth = (monthIndex) => {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
        setIsPickerOpen(false);
    };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = generateCalendarDays();
    const currentMonthStr = currentDate.toLocaleString('default', { month: 'short' });
    const currentYearStr = currentDate.getFullYear();
    const isToday = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenu(null);
            }
        };
        if (activeMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeMenu]);

    const fetchReasons = async () => {
        try {
            const response = await bookingApi.getReportCustomerReasonsList();
            if (response.data && response.data.responseData) {
                setReasonsList(response.data.responseData);
            } else if (response.data && response.data.data) {
                setReasonsList(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    const handleOpenCancelModal = async (e, booking) => {
        e.stopPropagation();
        setActiveMenu(null);

        const confirmed = await showConfirm('Are you sure you want to cancel this booking?');
        if (confirmed) {
            navigate('/dashboard/cancellation-policy', { state: { bookingId: booking.id } });
        }
    };

    const handleCancelSubmit = async () => {
        if (!cancelReason) {
            showMessage('Please select a reason', 'error');
            return;
        }

        try {
            setSubmittingCancel(true);
            const response = await bookingApi.cancelBooking(selectedBookingForCancel.id, cancelReason, cancelComment);
            const data = response.data || {};

            if (data.responseCode === 200 || data.status === 200 || data.status === 1) {
                showMessage(data.responseMessage || 'Booking cancelled successfully', 'success');
                setShowCancelModal(false);
                // Refresh list
                const formattedDate = formatDate(selectedDate);
                const listResponse = await bookingApi.getMyBookings(formattedDate);
                setBookings(listResponse.data?.responseData || listResponse.data?.data || []);
            } else {
                showMessage(data.responseMessage || 'Failed to cancel booking', 'error');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            showMessage('An error occurred while cancelling the booking.', 'error');
        } finally {
            setSubmittingCancel(false);
        }
    };

    const handleMarkAsCompleted = async (e, booking) => {
        e.stopPropagation();
        setActiveMenu(null);

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
                // Refresh list
                const formattedDate = formatDate(selectedDate);
                const listResponse = await bookingApi.getMyBookings(formattedDate);
                setBookings(listResponse.data?.responseData || listResponse.data?.data || []);
            } else {
                showMessage(data.responseMessage || data.message || 'Failed to complete booking', 'error');
            }
        } catch (error) {
            console.error('Error completing booking:', error);
            showMessage('An error occurred while completing the booking.', 'error');
        }
    };

    const handleReportRedirect = (e, bookingId) => {
        e.stopPropagation();
        setActiveMenu(null);
        localStorage.setItem('reportBookingId', bookingId);
        navigate('/dashboard/profile/report', { state: { iBookingId: bookingId } });
    };

    const formatBooking = (booking) => {
        let dateObj = new Date();
        const bookingDateStr = booking.dBookingDate || booking.date;
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

        const timeStr = booking.time || booking.vBookingTime || (booking.tFromTime && booking.tToTime ? `${booking.tFromTime} - ${booking.tToTime}` : null) || `${booking.vStartTime || '00:00'} - ${booking.vEndTime || '00:00'}`;

        const imageSrc = getImageUrl(booking.charImage || booking.txProfilePic || booking.txCharacterPic || booking.vCharacterImage || booking.vImage);

        return {
            id: booking.id || booking.iBookingId || Math.random(),
            day: dateObj.getDate().toString().padStart(2, '0'),
            month: dateObj.toLocaleString('default', { month: 'short' }),
            userName: booking.vUserName || booking.client || booking.userName || `${booking.vFirstName || ''} ${booking.vLastName || ''}`.trim() || 'Unknown User',
            charImage: imageSrc,
            charName: booking.vCharacterName || booking.charName || booking.character || 'Unknown Character',
            time: timeStr,
            location: booking.location || booking.vStreetAddress || booking.vAddress || booking.vLocation || 'Unknown Location',
            status: booking.status || (booking.tiStatus ? statusMap[booking.tiStatus] : null) || booking.eStatus || booking.vStatus || 'Pending'
        };
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <h2>My Bookings</h2>
                <div className="notification-icon" onClick={() => navigate('/dashboard/notifications')}>
                    🔔<span className="dot"></span>
                </div>
            </div>


            <div className="calendar-container">
                <div className="calendar-header">
                    <button className="nav-arrow desktop-only" onClick={handlePrevMonth}>&lt;</button>
                    <h1 className="month-year" onClick={togglePicker}>
                        {currentMonthStr} {currentYearStr}
                    </h1>
                    <button className="nav-arrow desktop-only" onClick={handleNextMonth}>&gt;</button>
                </div>

                <div
                    className={`calendar-body ${slideDirection}`}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="weekdays">
                        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>

                    <div className="days-grid">
                        {days.map((day, index) => {
                            const isSelected = day.fullDate &&
                                day.fullDate.getDate() === selectedDate.getDate() &&
                                day.fullDate.getMonth() === selectedDate.getMonth() &&
                                day.fullDate.getFullYear() === selectedDate.getFullYear();

                            const isTodayDate = day.fullDate && isToday(day.fullDate, new Date());

                            // Check if this date has a booking
                            const dateStr = day.fullDate ? formatDate(day.fullDate) : null;
                            const hasBooking = dateStr && bookingDates.includes(dateStr);

                            return (
                                <div
                                    key={index}
                                    className={`day-cell 
                                        ${!day.currentMonth ? 'other-month' : ''} 
                                        ${isSelected ? 'selected' : ''} 
                                        ${isTodayDate && !isSelected ? 'is-today' : ''}`
                                    }
                                    onClick={() => handleDateClick(day)}
                                >
                                    <div className="cell-content">
                                        {day.date}
                                        {hasBooking && <span className="booking-dot"></span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="dots-container">
                    {Array.from({ length: 4 }).map((_, idx) => {
                        const isActive = (currentDate.getMonth() % 4) === idx;
                        return (
                            <span
                                key={idx}
                                className={`carousel-dot ${isActive ? 'active' : ''}`}
                            ></span>
                        );
                    })}
                </div>
            </div>

            <div className="bookings-section">
                {loading ? (
                    <div className="loading-msg">Loading bookings...</div>
                ) : bookings.length > 0 ? (
                    <div className="bookings-list">
                        {bookings.map((booking, idx) => {
                            const formatted = formatBooking(booking);
                            return (
                                <div
                                    key={formatted.id || idx}
                                    className="booking-card"
                                    onClick={() => navigate(`/dashboard/profile/history/${formatted.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="date-badge">
                                        <span className="date-day">{formatted.day}</span>
                                        <span className="date-month">{formatted.month}</span>
                                    </div>

                                    <div className="card-body">
                                        <div className="user-info-header">
                                            <div className="avatar-circle">
                                                👤
                                            </div>
                                            <span className="user-full-name">{formatted.userName}</span>
                                        </div>

                                        <hr className="divider" />

                                        <div className="main-content">
                                            <div className="img-wrapper">
                                                <img src={formatted.charImage} alt="" className="booking-img" />
                                            </div>

                                            <div className="text-details">
                                                <h3 className="character-name">{formatted.charName}</h3>
                                                <div className="detail-row">
                                                    <span className="icon">🕒</span>
                                                    <span className="one-line">{formatted.time}</span>
                                                </div>

                                            </div>
                                        </div>

                                        <hr className="divider" />

                                        <div className="card-footer">
                                            <div className="status-box">
                                                {/* Status removed as per user request */}
                                            </div>

                                            <div className="action-menu" ref={activeMenu === formatted.id ? menuRef : null}>
                                                <button
                                                    className="dots-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenu(activeMenu === formatted.id ? null : formatted.id);
                                                    }}
                                                >
                                                    ⋮
                                                </button>
                                                {activeMenu === formatted.id && (
                                                    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                                        <button className="dropdown-item" onClick={(e) => handleOpenCancelModal(e, formatted)}>
                                                            Cancel Booking
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-bookings">
                        <p>No Bookings For The Selected Date</p>
                    </div>
                )}
            </div>

            {/* Mobile Picker Modal */}
            {isPickerOpen && (
                <div className="picker-overlay" onClick={() => setIsPickerOpen(false)}>
                    <div className="picker-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Select Month</h3>
                        <div className="months-grid">
                            {months.map((m, idx) => (
                                <div key={m} className="month-item" onClick={() => selectMonth(idx)}>
                                    {m}
                                </div>
                            ))}
                        </div>
                        <button className="close-btn" onClick={() => setIsPickerOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Cancel Booking Modal */}
            {showCancelModal && (
                <div className="picker-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="picker-modal cancel-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Cancel Booking</h3>
                        <div className="cancel-form">
                            <div className="form-group" style={{ textAlign: 'left', marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>Reason</label>
                                <select
                                    className="form-select"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                >
                                    <option value="">Select Reason</option>
                                    {reasonsList.map((reason, idx) => (
                                        <option key={idx} value={reason.iReasonId || reason.id}>
                                            {reason.vReason || reason.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ textAlign: 'left', marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>Comments</label>
                                <textarea
                                    className="form-textarea"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }}
                                    value={cancelComment}
                                    onChange={(e) => setCancelComment(e.target.value)}
                                    placeholder="Tell us why you're cancelling..."
                                />
                            </div>
                            <div className="modal-actions" style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    className="close-btn"
                                    style={{ flex: 1, backgroundColor: '#eee', color: '#333' }}
                                    onClick={() => setShowCancelModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="close-btn"
                                    style={{ flex: 1, backgroundColor: '#e74c3c', color: 'white' }}
                                    disabled={submittingCancel}
                                    onClick={handleCancelSubmit}
                                >
                                    {submittingCancel ? 'Cancelling...' : 'Cancel Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
