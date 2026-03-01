import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const timeSlots = [
        "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
        "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
        "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM",
        "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM",
        "09:00 PM - 10:00 PM", "10:00 PM - 11:00 PM"
    ];

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

    const handleUpdate = () => {
        console.log("Saving selection:", { dayStatus, selectedSlots });
        navigate('/dashboard/profile');
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
                                return (
                                    <div 
                                        key={idx} 
                                        className={`day-cell 
                                            ${!day.currentMonth ? 'empty' : ''} 
                                            ${isSelected(day.fullDate) ? 'selected' : ''} 
                                            ${isPast ? 'disabled' : ''}`
                                        }
                                        onClick={() => handleDateClick(day)}
                                    >
                                        {day.date}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="edit-availability-section">
                    <div className="section-header">
                        <h3>Edit Availability</h3>
                        <div className="selected-date-display">
                            {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            <span className="dropdown-icon">▼</span>
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
                                <div key={index} className="slot-row" onClick={() => handleSlotToggle(slot)}>
                                    <span>{slot}</span>
                                    <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`} 
                                         style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {isChecked && <span style={{ color: 'white', fontSize: '10px' }}>✓</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button className="update-btn" onClick={handleUpdate}>Update</button>
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