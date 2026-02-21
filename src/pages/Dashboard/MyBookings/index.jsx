import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../../api';
import './MyBookings.scss';


export default function MyBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await bookingApi.getMyBookings();
                setBookings(response.data);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum swipe distance in pixels
    const minSwipeDistance = 50;


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
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={`day-cell ${!day.currentMonth ? 'other-month' : ''} ${isToday(day.fullDate, selectedDate) ? 'selected' : ''}`}
                                onClick={() => handleDateClick(day)}
                            >
                                {day.date}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="dots-container">
                    {Array.from({ length: 4 }).map((_, idx) => {
                        // Sliding window logic: show 4 dots centered around current month
                        // We want 4 dots total. Let's map currentMonth index to one of these 4 dots.
                        // Simplest: currentMonth % 4
                        const isActive = (currentDate.getMonth() % 4) === idx;
                        return (
                            <span
                                key={idx}
                                className={`carousel-dot ${isActive ? 'active' : ''}`}
                            // Click logic omitted or could be based on current page
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
                        {bookings.map(booking => (
                            <div key={booking.id} className="booking-item-card">
                                <div className="booking-info">
                                    <h4>{booking.character}</h4>
                                    <span>{booking.client} • {booking.date}</span>
                                </div>
                                <div className={`status-badge ${booking.status}`}>
                                    {booking.status}
                                </div>
                            </div>
                        ))}
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
        </div>
    );
}
