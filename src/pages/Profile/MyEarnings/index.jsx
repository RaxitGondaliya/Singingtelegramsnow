import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../../components/layout/Header/Header';
import { bookingApi } from '../../../api/bookingApi';
import './MyEarnings.scss';

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];

const MyEarnings = () => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(() => months[new Date().getMonth()]);
    const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear().toString());
    const [earningsData, setEarningsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEarnings = useCallback(async (month, year) => {
        try {
            setLoading(true);
            const monthNum = months.indexOf(month) + 1;
            const response = await bookingApi.getMyEarnings(monthNum, year);
            
            // Check for successful response code (relaxed check for string/number)
            if (response.data && (response.data.responseCode == 200 || response.data.status === 'Success')) {
                const data = response.data.responseData || response.data.data;
                if (data) {
                    setEarningsData(data);
                }
            }
        } catch (error) {
            console.error("Error fetching earnings:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedMonth && selectedYear) {
            fetchEarnings(selectedMonth, selectedYear);
        }
    }, [selectedMonth, selectedYear, fetchEarnings]);

    const handleScroll = (e, type) => {
        const element = e.target;
        const itemHeight = 45; 
        const index = Math.round(element.scrollTop / itemHeight);
        
        if (type === 'month' && months[index]) setSelectedMonth(months[index]);
        if (type === 'year' && years[index]) setSelectedYear(years[index]);
    };

    // Helper to format currency or return 0.00
    const formatValue = (val) => {
        if (val === undefined || val === null) return '0.00';
        return val;
    };

    return (
        <div className="earnings-page">
            <Header title="My Earnings" />
            
            <div className="earnings-container">
                <div className="stats-dashboard-card">
                    <div className="card-filter-header" onClick={() => setIsPickerOpen(!isPickerOpen)}>
                        <span className="sort-label">Sort by</span>
                        <div className="month-selector">
                            <span className="month-text">{selectedMonth} {selectedYear}</span>
                            <div className="orange-circle-arrow">
                                <span className={`css-arrow ${isPickerOpen ? 'up' : 'down'}`}></span>
                            </div>
                        </div>
                    </div>

                    <hr className="card-divider" />

                    {isPickerOpen ? (
                        <div className="wheel-picker-container">
                            <div className="selection-highlight"></div>
                            <div className="picker-view">
                                <div className="picker-column" onScroll={(e) => handleScroll(e, 'month')}>
                                    <div className="spacer"></div>
                                    {months.map(m => (
                                        <div key={m} className={`picker-item ${selectedMonth === m ? 'active' : ''}`}>{m}</div>
                                    ))}
                                    <div className="spacer"></div>
                                </div>

                                <div className="picker-column" onScroll={(e) => handleScroll(e, 'year')}>
                                    <div className="spacer"></div>
                                    {years.map(y => (
                                        <div key={y} className={`picker-item ${selectedYear === y ? 'active' : ''}`}>{y}</div>
                                    ))}
                                    <div className="spacer"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="earnings-grid">
                            <div className="stat-item main-month">
                                <h2 className="val-large">${loading ? '...' : formatValue(earningsData?.fThisMonthEarning || earningsData?.fThisMonthEarnings)}</h2>
                                <p className="lbl-text">Selected Month</p>
                            </div>
                            <div className="secondary-stats-row">
                                <div className="stat-item">
                                    <h2 className="val-small">${loading ? '...' : formatValue(earningsData?.fPrevweekEarning || earningsData?.fPrevweekEarnings || earningsData?.fLastWeekEarnings)}</h2>
                                    <p className="lbl-text">Last Week</p>
                                </div>
                                <div className="stat-item">
                                    <h2 className="val-small">${loading ? '...' : formatValue(earningsData?.fThisweekEarning || earningsData?.fThisweekEarnings || earningsData?.fThisWeekEarnings)}</h2>
                                    <p className="lbl-text">This Week</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="details-card">
                    <div className="row">
                        <span>Total Earnings</span>
                        <span className="c-orange">${loading ? '...' : formatValue(earningsData?.fTotalEarning || earningsData?.fTotalEarnings)}</span>
                    </div>
                    <div className="row">
                        <span>Total Tip Earnings</span>
                        <span className="c-orange">${loading ? '...' : formatValue(earningsData?.fTipEarning || earningsData?.fTipEarnings)}</span>
                    </div>
                    <div className="row">
                        <span>Completed Orders</span>
                        <span className="c-green">{loading ? '...' : (earningsData?.iCompletedOrders ?? '0')}</span>
                    </div>
                    <div className="row">
                        <span>Cancelled Orders</span>
                        <span className="c-red">{loading ? '...' : (earningsData?.iCancelledOrders ?? '0')}</span>
                    </div>
                </div>

                <button className="btn-pdf">Export PDF</button>
            </div>
        </div>
    );
};


export default MyEarnings;


