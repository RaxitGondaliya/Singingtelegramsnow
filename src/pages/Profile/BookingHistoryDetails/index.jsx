import React, { useState } from 'react';
import Header from '../../../components/layout/Header/Header';
import './BookingHistoryDetails.scss';

const BookingHistoryDetails = () => {
    const [isPayoutOpen, setIsPayoutOpen] = useState(false);

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
                        {/* Chat button removed as requested */}
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

                    {/* Action Button */}
                    <div className="details-footer">
                        <div className="footer-button-wrapper">
                            <button className="btn-payout" onClick={() => setIsPayoutOpen(true)}>
                                Payout Details
                            </button>
                        </div>
                        <p className="cancel-policy">Booking Cancellation Policy</p>
                    </div>
                </div>
            </div>

            {/* Payout Details Overlay */}
            {isPayoutOpen && (
                <div className="payout-overlay" onClick={() => setIsPayoutOpen(false)}>
                    <div className="payout-sheet" onClick={(e) => e.stopPropagation()}>
                        <div className="sheet-header">
                            <h3>Payout Details</h3>
                            <button className="close-btn" onClick={() => setIsPayoutOpen(false)}>&times;</button>
                        </div>
                        <div className="sheet-content">
                            <div className="payout-row">
                                <span>Singing Telegram Base</span>
                                <strong>$5.00</strong>
                            </div>
                            <div className="payout-row">
                                <span>Tip Amount</span>
                                <strong>$0.00</strong>
                            </div>
                            <div className="payout-row">
                                <span>Travel Fee</span>
                                <strong>$0.00</strong>
                            </div>
                            <div className="payout-row">
                                <span>Add-Ons Reimbursement</span>
                                <strong>$0.00</strong>
                            </div>
                            <hr className="payout-divider" />
                            <div className="payout-row total">
                                <span>Total Payout</span>
                                <strong>$5.00</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistoryDetails;