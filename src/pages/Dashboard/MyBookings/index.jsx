import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../../api';
import { getImageUrl } from '../../../utils/imageUtils';
import { useMessage } from '../../../context/MessageContext';
import './MyBookings.scss';

// SVG Icons
const BellIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const ChevronRight = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
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

const MoreIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="12" cy="5" r="1"></circle>
        <circle cx="12" cy="19" r="1"></circle>
    </svg>
);


export default function MyBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [bookingDates, setBookingDates] = useState([]); 
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelComment, setCancelComment] = useState('');
    const [reasonsList, setReasonsList] = useState([]);
    const [submittingCancel, setSubmittingCancel] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    
    const menuRef = useRef(null);
    const { showMessage, showConfirm } = useMessage();
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
            let data = response.data?.responseData || response.data?.data || response.data || [];
            if (!Array.isArray(data)) data = [];
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
            let highlighted = [];
            if (response.data && Array.isArray(response.data.responseData)) {
                highlighted = response.data.responseData
                    .filter(item => item.tiIsAvailabile === 1 || item.tiIsAvailabile === '1')
                    .map(item => item.dBookingDate);
            }
            setBookingDates(highlighted);
        } catch (err) {
            console.error("Failed to fetch booking highlights", err);
        }
    };

    // Calendar logic
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month); 
        const daysInPrevMonth = getDaysInMonth(year, month - 1);
        const daysArray = [];

        for (let i = 0; i < firstDay; i++) {
            daysArray.push({ date: null, currentMonth: false, fullDate: new Date(year, month - 1, daysInPrevMonth - firstDay + 1 + i) });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push({ date: i, currentMonth: true, fullDate: new Date(year, month, i) });
        }
        const remaining = 42 - daysArray.length;
        for (let i = 1; i <= remaining; i++) {
            daysArray.push({ date: null, currentMonth: false, fullDate: new Date(year, month + 1, i) });
        }
        return daysArray;
    };

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEndSwipe = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) handleNextMonth();
        else if (distance < -minSwipeDistance) handlePrevMonth();
    };

    const handleDateClick = (day) => {
        setSelectedDate(day.fullDate);
        if (!day.currentMonth) setCurrentDate(new Date(day.fullDate.getFullYear(), day.fullDate.getMonth(), 1));
    };

    const handleOpenCancelModal = async (e, bookingId) => {
        e.stopPropagation();
        setActiveMenu(null);
        const confirmed = await showConfirm('Are you sure you want to cancel this booking?');
        if (confirmed) navigate('/dashboard/cancellation-policy', { state: { bookingId } });
    };

    const handleMarkAsCompleted = async (e, bookingId) => {
        e.stopPropagation();
        setActiveMenu(null);
        const confirmed = await showConfirm('Are you sure you want to mark this booking as completed?');
        if (!confirmed) return;
        try {
            const response = await bookingApi.completeBooking(bookingId);
            const data = response.data || {};
            const isSuccess = data.responseCode === 200 || data.status === 200 || data.status === 1;
            if (isSuccess) {
                showMessage(data.responseMessage || 'Booking marked as completed!', 'success');
                fetchBookings();
            } else {
                showMessage(data.responseMessage || 'Failed to complete booking', 'error');
            }
        } catch (error) {
            console.error('Error completing booking:', error);
            showMessage('An error occurred.', 'error');
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
        if (bookingDateStr) dateObj = new Date(bookingDateStr);
        const statusMap = { 1: 'Pending', 2: 'Confirmed', 3: 'Declined', 4: 'Completed', 5: 'Cancelled by Entertainer' };
        const timeStr = booking.time || booking.vBookingTime || (booking.tFromTime && booking.tToTime ? `${booking.tFromTime} - ${booking.tToTime}` : null) || `${booking.vStartTime || '00:00'} - ${booking.vEndTime || '00:00'}`;
        return {
            ...booking,
            id: booking.id || booking.iBookingId || Math.random(),
            day: (booking.day || dateObj.getDate().toString()).padStart(2, '0'),
            month: booking.month || dateObj.toLocaleString('default', { month: 'short' }),
            userName: booking.vUserName || booking.client || booking.userName || 'Unknown User',
            charImage: getImageUrl(booking.charImage || booking.vImage || booking.txProfilePic),
            charName: booking.vCharacterName || booking.charName || 'Unknown Character',
            time: timeStr,
            location: booking.location || booking.vStreetAddress || booking.vAddress || 'Unknown Location',
            status: booking.status || (booking.tiStatus ? statusMap[booking.tiStatus] : null) || 'Pending'
        };
    };

    const days = generateCalendarDays();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthLabel = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setActiveMenu(null);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const statusColors = { 'Pending': 'pending', 'Confirmed': 'confirmed', 'Completed': 'completed' };

    return (
        <div className="my-bookings-container">
            <header className="bookings-header">
                <h1>My Bookings</h1>
                <button className="notify-btn" onClick={() => navigate('/dashboard/notifications')}>
                    <BellIcon />
                    <span className="badge"></span>
                </button>
            </header>

            <div className="calendar-card" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndSwipe}>
                <div className="calendar-nav">
                    <button onClick={handlePrevMonth}><ChevronLeft /></button>
                    <h2 onClick={() => setIsPickerOpen(true)}>{currentMonthLabel}</h2>
                    <button onClick={handleNextMonth}><ChevronRight /></button>
                </div>
                
                <div className="calendar-grid-header">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
                </div>
                <div className="calendar-grid">
                    {days.map((day, idx) => {
                        const isSelected = day.fullDate && day.fullDate.toDateString() === selectedDate.toDateString();
                        const dateStr = day.fullDate ? formatDate(day.fullDate) : null;
                        const hasBooking = dateStr && bookingDates.includes(dateStr);
                        return (
                            <div 
                                key={idx} 
                                className={`day-cell ${!day.currentMonth ? 'empty' : ''} ${isSelected ? 'selected' : ''}`}
                                onClick={() => day.currentMonth && handleDateClick(day)}
                            >
                                {day.date}
                                {hasBooking && !isSelected && <div className="has-booking-dot"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            <main className="list-container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
                ) : bookings.length > 0 ? (
                    <div className="bookings-grid">
                        {bookings.map((booking, idx) => {
                            const formatted = formatBooking(booking);
                            const isMenuOpen = activeMenu === formatted.id;
                            const statusCls = statusColors[formatted.status] || '';
                            
                            return (
                                <div className="booking-card" key={formatted.id || idx} onClick={() => navigate(`/dashboard/profile/history/${formatted.id}`)}>
                                    <div className="date-badge">
                                        <span className="day">{formatted.day}</span>
                                        <span className="month">{formatted.month}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="header-info">
                                            <div className="avatar"><PersonIcon /></div>
                                            <span className="name">{formatted.userName}</span>
                                        </div>
                                        <div className="divider" style={{ margin: '8px 0 12px' }} />
                                        <div className="content-box">
                                            <img src={formatted.charImage} alt="" />
                                            <div className="details">
                                                <h4>{formatted.charName}</h4>
                                                <div className="info"><ClockIcon /><span>{formatted.time}</span></div>
                                                <div className="info"><LocationIcon /><span>{formatted.location}</span></div>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="status-sect">
                                                <span>Status:</span>
                                                <div className={`badge ${statusCls}`}>{formatted.status}</div>
                                            </div>
                                            <div style={{ position: 'relative' }} ref={isMenuOpen ? menuRef : null}>
                                                <button className="more-btn" onClick={(e) => { e.stopPropagation(); setActiveMenu(isMenuOpen ? null : formatted.id); }}>
                                                    <MoreIcon />
                                                </button>
                                                {isMenuOpen && (
                                                    <div className="custom-menu">
                                                        <button className="menu-item" onClick={(e) => handleOpenCancelModal(e, formatted.id)}>Cancel Booking</button>
                                                        {['Confirmed', 'Pending'].includes(formatted.status) && (
                                                            <button className="menu-item" onClick={(e) => handleMarkAsCompleted(e, formatted.id)}>Mark as Completed</button>
                                                        )}
                                                        <button className="menu-item" onClick={(e) => handleReportRedirect(e, formatted.id)}>Report It</button>
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
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No Bookings For The Selected Date</div>
                )}
            </main>

            {/* Custom Month Picker Overlay */}
            {isPickerOpen && (
                <div className="modal-overlay" onClick={() => setIsPickerOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '1rem' }}>Select Month</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {months.map((m, idx) => (
                                <button 
                                    key={m} 
                                    className={`btn ${currentDate.getMonth() === idx ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => {
                                        setCurrentDate(new Date(currentDate.getFullYear(), idx, 1));
                                        setIsPickerOpen(false);
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <div className="flex-end">
                            <button className="btn btn-secondary" onClick={() => setIsPickerOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
