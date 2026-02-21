import React, { useState } from 'react';
import Header from '../../components/Header';
import './MyEarnings.css';

const MyEarnings = () => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("FEB");
    const [selectedYear, setSelectedYear] = useState("2026");

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const years = ["2023", "2024", "2025", "2026", "2027", "2028"];

    const handleScroll = (e, type) => {
        const element = e.target;
        const itemHeight = 45; 
        const index = Math.round(element.scrollTop / itemHeight);
        
        if (type === 'month' && months[index]) setSelectedMonth(months[index]);
        if (type === 'year' && years[index]) setSelectedYear(years[index]);
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
                                {/* Pure CSS Arrow instead of FontAwesome Icon */}
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
                                <h2 className="val-large">$0.00</h2>
                                <p className="lbl-text">Selected Month</p>
                            </div>
                            <div className="secondary-stats-row">
                                <div className="stat-item">
                                    <h2 className="val-small">$0.00</h2>
                                    <p className="lbl-text">Last Week</p>
                                </div>
                                <div className="stat-item">
                                    <h2 className="val-small">$0.00</h2>
                                    <p className="lbl-text">This Week</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="details-card">
                    <div className="row"><span>Total Earnings</span><span className="c-orange">$43.20</span></div>
                    <div className="row"><span>Total Tip Earnings</span><span className="c-orange">$2.20</span></div>
                    <div className="row"><span>Completed Orders</span><span className="c-green">4</span></div>
                    <div className="row"><span>Cancelled Orders</span><span className="c-red">1</span></div>
                </div>

                <button className="btn-pdf">Export PDF</button>
            </div>
        </div>
    );
};

export default MyEarnings;