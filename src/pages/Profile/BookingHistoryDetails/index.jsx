import React from 'react';
import Header from '../../../components/layout/Header/Header';
import './BookingHistoryDetails.scss';

const BookingHistoryDetails = () => {
    return (
        <div className="details-page">
            <Header title="Booking Details" />
            
            <div className="details-container">
                <div className="details-card">
                    {/* User Header */}
                    <div className="user-section">
                        <div className="user-avatar">
                            <i className="fa-regular fa-user"></i>
                        </div>
                        <div className="user-meta">
                            <h3 className="user-name">Anita Volz</h3>
                            <p className="user-phone">📞 +1 4155550827</p>
                            <p className="payment-status">Payment status: <span className="paid">Paid</span></p>
                        </div>
                        <button className="chat-btn">💬</button>
                    </div>

                    <hr className="detail-divider" />

                    {/* Character Section */}
                    <div className="char-section">
                        <img src="https://placehold.co/60x60" alt="Character" className="char-thumb" />
                        <div className="char-info">
                            <span className="label">Character Name</span>
                            <h4 className="value-orange">Austin Powers</h4>
                        </div>
                    </div>

                    {/* TWO COLUMN GRID FOR DESKTOP */}
                    <div className="details-grid">
                        {/* Left Column */}
                        <div className="grid-column">
                            <div className="info-item">
                                <span className="label">Delivery Date</span>
                                <span className="value-orange">Oct 23, 2023 04:00 PM - 05:00 PM</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Occasion</span>
                                <span className="value">test1023</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Recipient Details</span>
                                <div className="icon-row">
                                    <span className="icon">👤</span>
                                    <span className="value">asdf</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="label">Location Name</span>
                                <span className="value">asdf</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Location Address</span>
                                <div className="address-box">
                                    <span className="icon-orange">📍</span>
                                    <span className="value">250 Howard Street, San Francisco, CA, USA</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="label">Contact Person Details @Delivery Location</span>
                                <div className="icon-row">
                                    <span className="icon-orange">👤</span>
                                    <span className="value">sdfa</span>
                                    <span className="icon-orange" style={{marginLeft: '15px'}}>📞</span>
                                    <span className="value-orange">456-456-4564</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="grid-column">

                            <div className="info-item">
                                <span className="label">Special Instruction for the location</span>
                                <span className="value">asdf</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Recipient Personal Info</span>
                                <span className="value">asfd</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Card Message</span>
                                <span className="value">asdf</span>
                            </div>

                            <div className="info-item">
                                <span className="label">From</span>
                                <span className="value">asdf</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Additional Notes</span>
                                <span className="value">afdsa</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Add-Ons Charges</span>
                                <span className="value">-</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button - Centered on Desktop */}
                    <div className="details-footer">
                        <div className="footer-button-wrapper">
                            <button className="btn-payout">Payout Details</button>
                        </div>
                        <p className="cancel-policy">Booking Cancellation Policy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingHistoryDetails;
