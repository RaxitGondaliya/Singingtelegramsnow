import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { availabilityApi } from '../../../api/availabilityApi';
import { useMessage } from '../../../context/MessageContext';
import Header from '../../../components/layout/Header/Header';
import './ManageAvailability.scss';

export default function Availability() {
    const navigate = useNavigate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');

    const [dayStatus, setDayStatus] = useState('not-available');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [existingBookings, setExistingBookings] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availabilityType, setAvailabilityType] = useState('day');
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [monthAvailabilities, setMonthAvailabilities] = useState([]);
    const { showMessage, showAlert } = useMessage();

    const fetchMonthAvailability = async (dateParam) => {
        try {
            const m = (dateParam.getMonth() + 1).toString().padStart(2, '0');
            const y = dateParam.getFullYear().toString();
            const response = await availabilityApi.getAvailabilityDates(m, y);
            if (response.data && response.data.responseData) {
                const availData = Array.isArray(response.data.responseData) ? response.data.responseData : [];
                setMonthAvailabilities(availData);
            }
        } catch (error) {
            console.error("Error fetching getavailabilitydates:", error);
        }
    };

    React.useEffect(() => {
        fetchMonthAvailability(currentDate);
    }, [currentDate]);

    React.useEffect(() => {
        const dateStr = formatDate(selectedDate);

        // Find if we already have data for this specific day in our month-wide fetch
        const existingDay = monthAvailabilities.find(item => {
            const itemDate = typeof item === 'string' ? item : (item.dAvailabilityDate || item.date);
            return itemDate && itemDate.startsWith(dateStr);
        });

        if (existingDay && existingDay.txSlots) {
            const bookingsData = existingDay.txSlots || [];
            let bookedList = [];
            let availableList = [];

            bookingsData.forEach(item => {
                const slotStr = `${item.tFromTime} - ${item.tToTime}`;
                if (item.tiIsbook === 1 || item.tiIsbook === '1') {
                    bookedList.push(slotStr);
                }
                if (item.tiIsavailable === 1 || item.tiIsavailable === '1' || item.tiIsAvailabile === 1 || item.tiIsAvailabile === '1') {
                    availableList.push(slotStr);
                }
            });

            setExistingBookings(bookingsData);
            setBookedSlots(bookedList);
            setSelectedSlots(availableList);

            if (availableList.length === 0) setDayStatus('not-available');
            else if (availableList.length === timeSlots.length) setDayStatus('available');
            else setDayStatus('specific-slots');
        } else {
            // Default state if no data exists for this day yet
            setExistingBookings([]);
            setBookedSlots([]);
            setSelectedSlots([]);
            setDayStatus('not-available');
        }
    }, [selectedDate, monthAvailabilities]);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const timeSlots = [
        "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
        "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
        "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM",
        "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM",
        "09:00 PM - 10:00 PM", "10:00 PM - 11:00 PM"
    ];

    const getWeekRange = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        const start = new Date(d.setDate(diff));
        const end = new Date(new Date(start).setDate(start.getDate() + 6));

        const sMonth = months[start.getMonth()];
        const sDay = start.getDate().toString().padStart(2, '0');
        const eMonth = months[end.getMonth()];
        const eDay = end.getDate().toString().padStart(2, '0');

        if (sMonth === eMonth) {
            return `${sMonth} ${sDay} - ${eDay}, ${end.getFullYear()}`;
        }
        return `${sMonth} ${sDay} - ${eMonth} ${eDay}, ${end.getFullYear()}`;
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const daysArray = [];

        for (let i = 0; i < firstDay; i++) {
            daysArray.push({ date: null, currentMonth: false, fullDate: null });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push({
                date: i,
                currentMonth: true,
                fullDate: new Date(year, month, i)
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

    const handleDateClick = (day) => {
        if (!day.currentMonth || !day.fullDate) return;
        if (day.fullDate < today) return;
        setSelectedDate(day.fullDate);
    };

    // Toggles individual slots
    const handleSlotToggle = (slot) => {
        setDayStatus('specific-slots');
        setSelectedSlots(prev =>
            prev.includes(slot)
                ? prev.filter(item => item !== slot)
                : [...prev, slot]
        );
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const dateStr = formatDate(selectedDate);
            const statusStr = dayStatus === 'available' ? 'Available' : dayStatus === 'not-available' ? 'Unavailable' : 'Specific';


            const vTimeSlotsArray = timeSlots
                .map((slotStr, idx) => ({ slotStr, id: idx + 1 }))
                .filter(item => selectedSlots.includes(item.slotStr))
                .map(item => ({ iAvailabilityTimeId: item.id }));

            const txAvailability = {
                dAvailabilityDate: dateStr,
                tiIsavailable: dayStatus === 'not-available' ? 0 : 1,
                tiIsSpecificTime: dayStatus === 'specific-slots' ? 1 : 0,
                eStatus: 'Specific',
                vTimeSlots: vTimeSlotsArray,
                vType: availabilityType
            };

            if (!availabilityApi) {
                console.error("availabilityApi is UNDEFINED!");
                window.alert("Critical error: availabilityApi service is missing.");
                return;
            }

            const response = await availabilityApi.manageAvailability(txAvailability);

            const data = response.data || {};

            const isSuccess = (data.responseCode === 200 || data.responseCode === '200' ||
                data.status === 200 || data.status === '200' ||
                data.status === 1 || data.status === '1') ||
                (!data.responseCode && !data.status && response.status === 200);

            if (isSuccess) {
                showMessage(data.responseMessage || data.message || 'Availability updated successfully!', 'success');
                fetchMonthAvailability(currentDate);
                // Removed navigate('/dashboard/profile') so user stays on calendar
            } else {
                showMessage(data.responseMessage || data.message || 'Failed to update availability', 'error');
            }
        } catch (error) {
            console.error("Failed to update availability", error);
            window.alert("API Error: " + (error.message || "Unknown error"));
            const errorMsg = error.response?.data?.responseMessage ||
                error.response?.data?.message ||
                'An error occurred while updating availability.';
            showMessage(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const days = generateCalendarDays();

    const isSelected = (d) =>
        d && d.getDate() === selectedDate.getDate() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear();

    return (
        <div className="availability-container">
            <Header title="Manage Availability" onBack={() => navigate('/dashboard/profile')} />

            <div className="content-layout">
                <div className="calendar-section">
                    <div className="calendar-header">
                        <button className="nav-arrow" onClick={handlePrevMonth}>&lt;</button>
                        <h2 className="month-year" onClick={() => setIsPickerOpen(true)}>
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button className="nav-arrow" onClick={handleNextMonth}>&gt;</button>
                    </div>

                    <div className={`calendar-body ${slideDirection}`}>
                        <div className="weekdays">
                            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                        </div>
                        <div className="days-grid">
                            {days.map((day, idx) => {
                                const isPast = day.fullDate && day.fullDate < today && day.currentMonth;

                                const checkHasAvail = (d) => {
                                    if (!d || d < today) return false;
                                    const fDate = formatDate(d);
                                    return monthAvailabilities.some(item => {
                                        if (typeof item === 'string') return item.startsWith(fDate);
                                        if (item.dAvailabilityDate) {
                                            return item.dAvailabilityDate.startsWith(fDate) && (item.tiIsAvailabile === 1 || item.tiIsAvailabile === '1');
                                        }
                                        if (item.date) return item.date.startsWith(fDate);
                                        return false;
                                    });
                                };

                                const currentHasAvail = checkHasAvail(day.fullDate);
                                const prevDay = idx > 0 ? days[idx - 1] : null;
                                const nextDay = idx < days.length - 1 ? days[idx + 1] : null;

                                const prevHasAvail = prevDay && checkHasAvail(prevDay.fullDate);
                                const nextHasAvail = nextDay && checkHasAvail(nextDay.fullDate);

                                const isStartOfWeek = idx % 7 === 0;
                                const isEndOfWeek = idx % 7 === 6;

                                const isStreakStart = currentHasAvail && (!prevHasAvail || isStartOfWeek);
                                const isStreakEnd = currentHasAvail && (!nextHasAvail || isEndOfWeek);

                                return (
                                    <div
                                        key={idx}
                                        className={`day-cell 
                                            ${!day.currentMonth ? 'empty' : ''} 
                                            ${isSelected(day.fullDate) ? 'selected' : ''} 
                                            ${isPast ? 'disabled' : ''}
                                            ${currentHasAvail ? 'has-availability' : ''}
                                            ${isStreakStart ? 'streak-start' : ''}
                                            ${isStreakEnd ? 'streak-end' : ''}`
                                        }
                                        onClick={() => handleDateClick(day)}
                                    >
                                        <span className="date-text">{day.date}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="edit-availability-section">
                    <div className="section-header">
                        <h3>Edit Availability</h3>
                        <div className="selected-date-display" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}>
                            {availabilityType === 'week' ? getWeekRange(selectedDate) : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            <span className="dropdown-icon">{isTypeDropdownOpen ? '▲' : '▼'}</span>

                            {isTypeDropdownOpen && (
                                <div className="type-dropdown-menu" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    backgroundColor: '#fff',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    borderRadius: '8px',
                                    zIndex: 10,
                                    width: '320px',
                                    padding: '10px 0',
                                    marginTop: '10px',
                                    border: '1px solid #ddd'
                                }}>
                                    <div className="type-option" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }} onClick={(e) => { e.stopPropagation(); setAvailabilityType('week'); setIsTypeDropdownOpen(false); }}>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', margin: 0 }}>
                                            <input type="radio" checked={availabilityType === 'week'} readOnly style={{ marginRight: '15px', accentColor: '#f58220', width: '18px', height: '18px' }} />
                                            <span style={{ fontSize: '15px', fontWeight: '500', color: availabilityType === 'week' ? '#000' : '#444' }}>Weekly</span>
                                        </label>
                                        <span style={{ color: '#f58220', fontSize: '14px', fontWeight: '500' }}>{getWeekRange(selectedDate)}</span>
                                    </div>
                                    <div className="type-option" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setAvailabilityType('day'); setIsTypeDropdownOpen(false); }}>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', margin: 0 }}>
                                            <input type="radio" checked={availabilityType === 'day'} readOnly style={{ marginRight: '15px', accentColor: '#f58220', width: '18px', height: '18px' }} />
                                            <span style={{ fontSize: '15px', fontWeight: '500', color: availabilityType === 'day' ? '#000' : '#444' }}>Single Day</span>
                                        </label>
                                        <span style={{ color: '#f58220', fontSize: '14px', fontWeight: '500' }}>{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="availability-options">
                        <label className="option-row">
                            <span>Full Day Not Available</span>
                            <input
                                type="radio"
                                name="avail"
                                checked={dayStatus === 'not-available'}
                                onChange={() => {
                                    setDayStatus('not-available');
                                    setSelectedSlots([]); // Clears all checkmarks
                                }}
                            />
                            <span className="custom-radio"></span>
                        </label>

                        <label className="option-row">
                            <span>Full Day Available</span>
                            <input
                                type="radio"
                                name="avail"
                                checked={dayStatus === 'available'}
                                onChange={() => {
                                    setDayStatus('available');
                                    setSelectedSlots([...timeSlots]); // Checks ALL time slots
                                }}
                            />
                            <span className="custom-radio"></span>
                        </label>
                    </div>

                    <div className="time-slots-list">
                        {timeSlots.map((slot, index) => {
                            const isChecked = selectedSlots.includes(slot);
                            return (
                                <div
                                    key={index}
                                    className={`slot-row ${bookedSlots.includes(slot) ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (bookedSlots.includes(slot)) {
                                            showAlert('You already have booking scheduling for this duration');
                                        } else {
                                            handleSlotToggle(slot);
                                        }
                                    }}
                                    style={{ cursor: bookedSlots.includes(slot) ? 'pointer' : 'pointer' }}
                                >
                                    <span style={{ color: bookedSlots.includes(slot) ? '#999' : 'inherit' }}>{slot}</span>
                                    <div className={`custom-checkbox ${isChecked ? 'checked' : ''} ${bookedSlots.includes(slot) ? 'booked-locked' : ''}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: bookedSlots.includes(slot) ? 0.6 : 1
                                        }}>
                                        {isChecked && <span style={{ color: 'white', fontSize: '10px' }}>✓</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button className="update-btn" onClick={handleUpdate} disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>

            {/* Month Picker Modal */}
            {isPickerOpen && (
                <div className="picker-overlay" onClick={() => setIsPickerOpen(false)}>
                    <div className="picker-modal" onClick={e => e.stopPropagation()}>
                        <h3>Select Month</h3>
                        <div className="months-grid">
                            {months.map((m, i) => (
                                <div key={m} className="month-item" onClick={() => {
                                    setCurrentDate(new Date(currentDate.getFullYear(), i, 1));
                                    setIsPickerOpen(false);
                                }}>{m}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}