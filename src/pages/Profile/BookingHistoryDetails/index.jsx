import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { bookingApi } from '../../../api/bookingApi';
import { getImageUrl } from '../../../utils/imageUtils';
import './BookingHistoryDetails.scss';

const BookingHistoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isPayoutOpen, setIsPayoutOpen] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await bookingApi.getBookingDetails(id);
                console.log('Booking details response:', response.data);

                if (response.data && response.data.responseData) {
                    setBookingDetails(response.data.responseData);
                } else if (response.data && response.data.data) {
                    setBookingDetails(response.data.data);
                } else {
                    setBookingDetails(response.data);
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="details-page">
                <Header title="Booking Details" />
                <div className="details-container" style={{ padding: '20px', textAlign: 'center' }}>
                    Loading details...
                </div>
            </div>
        );
    }

    if (!bookingDetails) {
        return (
            <div className="details-page">
                <Header title="Booking Details" />
                <div className="details-container" style={{ padding: '20px', textAlign: 'center' }}>
                    No details found for this booking.
                </div>
            </div>
        );
    }

    // Safely extract deeply nested data or top-level data depending on API structure
    // Since we don't know the exact response format yet, we'll setup robust fallbacks
    const data = bookingDetails;

    // Formatting helpers
    const getAvatar = () => getImageUrl(data.txProfilePic || data.vProfilePic || data.txCharacterPic || data.vImage, '');
    const getUserName = () => data.vUserName || `${data.vFirstName || ''} ${data.vLastName || ''}`.trim() || 'Unknown User';

    // Sometimes backend returns nested objects, sometimes flat
    const locationObj = data.location || {};
    const recipientObj = data.recipient || {};
    const detailsObj = data.details || {};
    const paymentObj = data.bookingPaymentDetails || data.payout || {};

    let phoneStr = data.vMobileNumber || data.vPhoneNumber || data.vMobile || data.vPhone || locationObj.vPhoneNumber || '';
    if (data.vISDCode && phoneStr && !phoneStr.startsWith('+')) phoneStr = `${data.vISDCode} ${phoneStr}`;

    const statusMap = {
        1: 'Pending',
        2: 'Confirmed',
        3: 'Declined',
        4: 'Completed',
        5: 'Reported'
    };
    const paymentStatus = data.vPaymentStatus || data.paymentStatus || (data.tiStatus ? statusMap[data.tiStatus] : 'Completed');

    // Determine the color class based on tiStatus
    const statusColorMap = {
        2: 'status-confirmed',   // blue
        3: 'status-declined',    // red
        4: 'status-completed',   // green
    };
    const statusColorClass = statusColorMap[data.tiStatus] || 'paid';

    // Time/Date formatting
    let dateTimeStr = `${data.dBookingDate || ''} ${data.tFromTime || ''} - ${data.tToTime || ''}`;
    if (!data.dBookingDate && data.vBookingDate) {
        dateTimeStr = `${data.vBookingDate} ${data.vBookingTime || ''}`;
    }

    // Image fallback
    const charImg = getImageUrl(data.vImage || data.txCharacterPic || data.vCharacterImage, 'https://placehold.co/60x60');

    return (
        <div className="details-page">
            <Header title="Booking Details" />

            <div className="details-container">
                <div className="details-card">
                    {/* User Header */}
                    <div className="user-section">
                        <div className="user-avatar">
                            {getAvatar() ? (
                                <img src={getAvatar()} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <i className="fa-regular fa-user"></i>
                            )}
                        </div>
                        <div className="user-meta">
                            <h3 className="user-name">{getUserName()}</h3>
                            <p className="user-phone">📞 {phoneStr || 'N/A'}</p>
                            <p className="payment-status">Payment Status: <span className={statusColorClass}>{paymentStatus}</span></p>
                        </div>
                    </div>

                    <hr className="detail-divider" />

                    {/* Character Section */}
                    <div className="char-section">
                        <img src={charImg} alt="Character" className="char-thumb" />
                        <div className="char-info">
                            <span className="label">Character Name</span>
                            <h4 className="value-orange">{data.vCharacterName || data.charName || 'Unknown'}</h4>
                        </div>
                    </div>

                    {/* TWO COLUMN GRID FOR DESKTOP */}
                    <div className="details-grid">
                        {/* Left Column */}
                        <div className="grid-column">
                            <div className="info-item">
                                <span className="label">Delivery Date</span>
                                <span className="value-orange">{dateTimeStr || 'N/A'}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Occasion</span>
                                <span className="value">{data.vOccasion || detailsObj.vOccasion || 'N/A'}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Recipient Details</span>
                                <div className="icon-row">
                                    <span className="icon">👤</span>
                                    <span className="value">{data.vRcepientName || recipientObj.vRecipientName || data.vRecipientName || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="label">Location Name</span>
                                <span className="value">{data.vLocationName || locationObj.vLocationName || 'N/A'}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Location Address</span>
                                <div className="address-box">
                                    <span className="icon-orange">📍</span>
                                    <span className="value">{data.vLocationAddress || data.vStreetAddress || locationObj.vStreetAddress || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="label">Contact Person Details @Delivery Location</span>
                                <div className="icon-row">
                                    <span className="icon-orange">👤</span>
                                    <span className="value">{data.vContactPersonDeliveryLocation || data.vContactPersonName || locationObj.vContactPersonName || 'N/A'}</span>
                                    <span className="icon-orange" style={{ marginLeft: '15px' }}>📞</span>
                                    <span className="value-orange">{data.vPhoneNumberDeliveryLocation || data.vContactPersonNumber || locationObj.vContactPersonNumber || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="grid-column">
                            <div className="info-item">
                                <span className="label">Special Instruction for the location</span>
                                <span className="value">{data.vSpecialInstructions || data.txSpecialInstruction || locationObj.txSpecialInstruction || 'N/A'}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Recipient Personal Info</span>
                                <span className="value">{data.vRecipientPersonalInfo || recipientObj.txPersonalInfo || data.txRecipientPersonalInfo || 'N/A'}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Card Message</span>
                                <span className="value">{data.vCardMessage || detailsObj.txCardMessage || data.txCardMessage || 'N/A'}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">From</span>
                                <span className="value">{data.vCardFrom || detailsObj.vFrom || data.vFrom || 'N/A'}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Additional Notes</span>
                                <span className="value">{data.vAdditionalNotes || detailsObj.txAdditionalNotes || data.txAdditionalNotes || 'N/A'}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Add-Ons Charges</span>
                                <span className="value">{data.dAddOnCharges || paymentObj?.fAddOnAmount ? `$${data.dAddOnCharges || paymentObj.fAddOnAmount}` : '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="details-footer">
                        {data.tiStatus !== 3 && data.tiStatus !== '3' && (
                            <div className="footer-button-wrapper">
                                <button className="btn-payout" onClick={() => setIsPayoutOpen(true)}>
                                    Payout Details
                                </button>
                            </div>
                        )}
                        <p className="cancel-policy" onClick={() => navigate('/dashboard/cancellation-policy')} style={{ cursor: 'pointer' }}>Booking Cancellation Policy</p>
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
                                <strong>${paymentObj.fPayableAmount.toFixed(2) || '0.00'}</strong>
                            </div>
                            <div className="payout-row">
                                <span>Tip Amount</span>
                                <strong>${paymentObj.fTipAmount.toFixed(2) || paymentObj.dTipAmount.toFixed(2) || data.dDriverTip.toFixed(2) || data.fTipPercentage.toFixed(2) || '0.00'}</strong>
                            </div>
                            <div className="payout-row">
                                <span>Travel Fee</span>
                                <strong>${paymentObj.fTravelFee.toFixed(2) || paymentObj.dTravelFee.toFixed(2) || data.dTravelFee.toFixed(2) || '0.00'}</strong>
                            </div>
                            <div className="payout-row">
                                <span>Add-Ons Reimbursement</span>
                                <strong>${paymentObj.fAddOnAmount?.toFixed(2) || paymentObj.dAddOnReimbursement.toFixed(2) || data.dAddOnCharges.toFixed(2) || '0.00'}</strong>
                            </div>
                            <hr className="payout-divider" />
                            <div className="payout-row total">
                                <span>Total Payout</span>
                                <strong>${paymentObj.fTotalAmount?.toFixed(2) || paymentObj.dTotalPayout?.toFixed(2) || data.dDriverTotalAmount?.toFixed(2) || data.fPrice?.toFixed(2) || '0.00'}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistoryDetails;