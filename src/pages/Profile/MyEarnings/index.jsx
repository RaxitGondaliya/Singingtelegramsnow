import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../../components/layout/Header/Header';
import { bookingApi } from '../../../api/bookingApi';
import './MyEarnings.scss';

// SVG Icons
const PdfIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028"];

const MyEarnings = () => {
    const [selectedMonth, setSelectedMonth] = useState(() => months[new Date().getMonth()]);
    const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear().toString());
    const [earningsData, setEarningsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEarnings = useCallback(async (month, year) => {
        try {
            setLoading(true);
            const monthNum = months.indexOf(month) + 1;
            const response = await bookingApi.getMyEarnings(monthNum, year);
            if (response.data && (response.data.responseCode == 200 || response.data.status === 'Success')) {
                setEarningsData(response.data.responseData || response.data.data);
            }
        } catch (err) { console.error("Error fetching", err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        if (selectedMonth && selectedYear) fetchEarnings(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear, fetchEarnings]);

    const formatVal = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    return (
        <div className="my-earnings-container">
            <Header title="My Earnings" />
            
            <div className="earnings-wrapper">
                <main className="card">
                    <div className="sort-header">
                        <label>Sort by</label>
                        <div className="select-group">
                            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="divider" />

                    {loading ? (
                        <div className="loading-wrap">
                            <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: '#e14b3b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        </div>
                    ) : (
                        <div className="main-total">
                            <div className="amount">${formatVal(earningsData?.fThisMonthEarning || earningsData?.fThisMonthEarnings)}</div>
                            <div className="label">Selected Month Earnings</div>
                        </div>
                    )}

                    <div className="stats-grid">
                        <div className="stat-box">
                            <div className="amount">${formatVal(earningsData?.fPrevweekEarning || earningsData?.fPrevweekEarnings || earningsData?.fLastWeekEarnings)}</div>
                            <div className="label">Last Week</div>
                        </div>
                        <div className="stat-box">
                            <div className="amount">${formatVal(earningsData?.fThisweekEarning || earningsData?.fThisweekEarnings || earningsData?.fThisWeekEarnings)}</div>
                            <div className="label">This Week</div>
                        </div>
                    </div>
                </main>

                <div className="card" style={{ padding: '0.5rem 1.75rem' }}>
                    <div className="list-summary">
                        <div className="list-item warning">
                            <span className="label">Total Earnings</span>
                            <span className="value">${loading ? '...' : formatVal(earningsData?.fTotalEarning || earningsData?.fTotalEarnings)}</span>
                        </div>
                        <div className="list-item warning">
                            <span className="label">Total Tip Earnings</span>
                            <span className="value">${loading ? '...' : formatVal(earningsData?.fTipEarning || earningsData?.fTipEarnings)}</span>
                        </div>
                        <div className="list-item success">
                            <span className="label">Completed Orders</span>
                            <span className="value">{loading ? '...' : (earningsData?.iCompletedOrders ?? '0')}</span>
                        </div>
                        <div className="list-item error">
                            <span className="label">Cancelled Orders</span>
                            <span className="value">{loading ? '...' : (earningsData?.iCancelledOrders ?? '0')}</span>
                        </div>
                    </div>
                </div>

                <button className="export-btn">
                    <PdfIcon /> Export PDF
                </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default MyEarnings;
