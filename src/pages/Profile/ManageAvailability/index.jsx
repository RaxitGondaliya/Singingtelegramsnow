import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { availabilityApi } from '../../../api/availabilityApi';
import { useMessage } from '../../../context/MessageContext';
import Header from '../../../components/layout/Header/Header';
import './ManageAvailability.scss';

// SVG Icons
const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const ChevronRight = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

const DropDownIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);


export default function Availability() {
    const navigate = useNavigate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [dayStatus, setDayStatus] = useState('not-available');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availabilityType, setAvailabilityType] = useState('day');
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [monthAvailabilities, setMonthAvailabilities] = useState([]);
    const { showMessage, showAlert } = useMessage();
    const dropdownRef = useRef(null);

    const timeSlots = [
        "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
        "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
        "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM",
        "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM",
        "09:00 PM - 10:00 PM", "10:00 PM - 11:00 PM"
    ];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const fetchMonthAvailability = async (dateParam) => {
        try {
            const m = (dateParam.getMonth() + 1).toString().padStart(2, '0');
            const y = dateParam.getFullYear().toString();
            const response = await availabilityApi.getAvailabilityDates(m, y);
            if (response.data && response.data.responseData) {
                const availData = Array.isArray(response.data.responseData) ? response.data.responseData : [];
                setMonthAvailabilities(availData);
            }
        } catch (err) { console.error("Error fetching", err); }
    };

    useEffect(() => { fetchMonthAvailability(currentDate); }, [currentDate]);

    useEffect(() => {
        const dateStr = formatDate(selectedDate);
        const existingDay = monthAvailabilities.find(item => {
            const itemDate = item.dAvailabilityDate || item.date;
            return itemDate && itemDate.startsWith(dateStr);
        });

        if (existingDay && existingDay.txSlots) {
            let bookedList = [];
            let availableList = [];
            existingDay.txSlots.forEach(item => {
                const slotStr = `${item.tFromTime} - ${item.tToTime}`;
                if (item.tiIsbook === 1 || item.tiIsbook === '1') bookedList.push(slotStr);
                if (item.tiIsavailable === 1 || item.tiIsavailable === '1' || item.tiIsAvailabile === 1) availableList.push(slotStr);
            });

            setBookedSlots(bookedList);
            setSelectedSlots(availableList);
            if (availableList.length === 0) setDayStatus('not-available');
            else if (availableList.length === timeSlots.length) setDayStatus('available');
            else setDayStatus('specific-slots');
        } else {
            setBookedSlots([]); setSelectedSlots([]); setDayStatus('not-available');
        }
    }, [selectedDate, monthAvailabilities]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsTypeDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    };

    const getWeekRange = (date) => {
        const d = new Date(date);
        const diff = d.getDate() - d.getDay();
        const start = new Date(d.setDate(diff));
        const end = new Date(new Date(start).setDate(start.getDate() + 6));
        return `${months[start.getMonth()]} ${start.getDate().toString().padStart(2, '0')} - ${end.getDate().toString().padStart(2, '0')}, ${end.getFullYear()}`;
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const vTimeSlotsArray = timeSlots
                .map((slotStr, idx) => ({ slotStr, id: idx + 1 }))
                .filter(item => selectedSlots.includes(item.slotStr))
                .map(item => ({ iAvailabilityTimeId: item.id }));

            const payload = {
                dAvailabilityDate: formatDate(selectedDate),
                tiIsavailable: dayStatus === 'not-available' ? 0 : 1,
                tiIsSpecificTime: dayStatus === 'specific-slots' ? 1 : 0,
                eStatus: 'Specific',
                vTimeSlots: vTimeSlotsArray,
                vType: availabilityType
            };

            const res = await availabilityApi.manageAvailability(payload);
            const data = res.data || {};
            if (data.responseCode == 200 || data.status == 200 || data.status == 1) {
                showMessage(data.responseMessage || 'Availability updated!', 'success');
                fetchMonthAvailability(currentDate);
            } else {
                showMessage(data.responseMessage || 'Failed to update', 'error');
            }
        } catch (err) {
            console.error(err);
            showMessage('API Error', 'error');
        } finally { setLoading(false); }
    };

    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) days.push({ date: null, currentMonth: false, fullDate: null });
    for (let i = 1; i <= daysInMonth; i++) days.push({ date: i, currentMonth: true, fullDate: new Date(year, month, i) });

    const checkHasAvail = (d) => {
        if (!d || d < today) return false;
        const fDate = formatDate(d);
        return monthAvailabilities.some(item => {
            const itemDate = item.dAvailabilityDate || item.date;
            return itemDate && itemDate.startsWith(fDate) && (item.tiIsAvailabile == 1 || item.tiIsavailable == 1);
        });
    };

    return (
        <div className="manage-availability-container">
            <Header title="Manage Availability" onBack={() => navigate('/dashboard/profile')} />

            <div className="flex-row">
                {/* Calendar Card */}
                <div className="calendar-section">
                    <div className="card">
                        <div className="calendar-header">
                            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><ChevronLeft /></button>
                            <span className="month-label" onClick={() => setIsPickerOpen(true)}>{months[month]} {year}</span>
                            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><ChevronRight /></button>
                        </div>
                        <div className="calendar-weekdays">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => <span key={w}>{w}</span>)}
                        </div>
                        <div className="calendar-grid">
                            {days.map((day, idx) => {
                                const isSel = day.fullDate && day.fullDate.toDateString() === selectedDate.toDateString();
                                const isPast = day.fullDate && day.fullDate < today && day.currentMonth;
                                const hasAvail = checkHasAvail(day.fullDate);
                                return (
                                    <div 
                                        key={idx}
                                        className={`day-cell ${!day.currentMonth ? 'empty' : ''} ${isPast ? 'past' : ''} ${isSel ? 'selected' : ''} ${hasAvail ? 'has-avail' : ''}`}
                                        onClick={() => day.currentMonth && !isPast && setSelectedDate(day.fullDate)}
                                    >
                                        {day.date}
                                        {hasAvail && !isSel && day.currentMonth && <div className="avail-dot"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Edit Section Card */}
                <div className="edit-section">
                    <div className="card">
                        <h3>Edit Availability</h3>
                        
                        <div className="type-selector" onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)} ref={dropdownRef}>
                            <span>{availabilityType === 'week' ? getWeekRange(selectedDate) : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <DropDownIcon />
                            {isTypeDropdownOpen && (
                                <div className="custom-dropdown">
                                    <div className={`dropdown-item ${availabilityType === 'week' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setAvailabilityType('week'); setIsTypeDropdownOpen(false); }}>
                                        <div>Weekly <span className="sub-label">{getWeekRange(selectedDate)}</span></div>
                                        {availabilityType === 'week' && <CheckIcon />}
                                    </div>
                                    <div className={`dropdown-item ${availabilityType === 'day' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setAvailabilityType('day'); setIsTypeDropdownOpen(false); }}>
                                        <div>Single Day <span className="sub-label">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                                        {availabilityType === 'day' && <CheckIcon />}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="status-options">
                            <label>
                                <input type="radio" checked={dayStatus === 'not-available'} onChange={() => { setDayStatus('not-available'); setSelectedSlots([]); }} />
                                Full Day Not Available
                            </label>
                            <label>
                                <input type="radio" checked={dayStatus === 'available'} onChange={() => { setDayStatus('available'); setSelectedSlots([...timeSlots]); }} />
                                Full Day Available
                            </label>
                        </div>

                        <div className="slots-container">
                            <div className="slots-grid">
                                {timeSlots.map((slot, idx) => {
                                    const isBooked = bookedSlots.includes(slot);
                                    const isChecked = selectedSlots.includes(slot);
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`slot-item ${isChecked ? 'checked' : ''} ${isBooked ? 'booked' : ''}`}
                                            onClick={() => {
                                                if (isBooked) showAlert('Slot already booked');
                                                else {
                                                    setDayStatus('specific-slots');
                                                    setSelectedSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);
                                                }
                                            }}
                                        >
                                            <span>{slot}</span>
                                            {isBooked ? <LockIcon /> : isChecked && <CheckIcon />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button className="update-btn" onClick={handleUpdate} disabled={loading}>
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Month Picker */}
            {isPickerOpen && (
                <div className="month-modal" onClick={() => setIsPickerOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Select Month</h3>
                        <div className="months-grid">
                            {months.map((m, i) => (
                                <button key={m} className={month === i ? 'active' : ''} onClick={() => { setCurrentDate(new Date(year, i, 1)); setIsPickerOpen(false); }}>{m}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}