import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { bookingApi } from '../../../api/bookingApi';
import { getImageUrl } from '../../../utils/imageUtils';
import './BookingHistoryDetails.scss';

// SVG Icons
const PersonIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const LocationIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);


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
                const res = await bookingApi.getBookingDetails(id);
                setBookingDetails(res.data?.responseData || res.data?.data || res.data);
            } catch (err) { console.error('Error fetching details:', err); }
            finally { setLoading(false); }
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="booking-details-container">
                <Header title="Booking Details" />
                <div className="loading-wrap">
                    <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: '#e14b3b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!bookingDetails) {
        return (
            <div className="booking-details-container">
                <Header title="Booking Details" />
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No details found for this booking.</div>
            </div>
        );
    }

    const data = bookingDetails;
    const getAvatar = () => getImageUrl(data.txProfilePic || data.vProfilePic || data.txCharacterPic || data.vImage);
    const getUserName = () => data.vUserName || `${data.vFirstName || ''} ${data.vLastName || ''}`.trim() || 'Unknown User';
    
    const locationObj = data.location || {};
    const recipientObj = data.recipient || {};
    const detailsObj = data.details || {};
    const paymentObj = data.bookingPaymentDetails || data.payout || {};

    let phoneStr = data.vMobileNumber || data.vPhoneNumber || data.vMobile || data.vPhone || locationObj.vPhoneNumber || '';
    if (data.vISDCode && phoneStr && !phoneStr.startsWith('+')) phoneStr = `${data.vISDCode} ${phoneStr}`;

    const statusMap = { 1: 'Pending', 2: 'Confirmed', 3: 'Declined', 4: 'Completed', 5: 'Cancelled by Entertainer' };
    const paymentStatus = data.vPaymentStatus || data.paymentStatus || (data.tiStatus ? statusMap[data.tiStatus] : 'Completed');
    
    // Status Classes
    const getStatusCls = (st) => {
        const val = Number(st);
        if (val === 2) return 'info';
        if (val === 3 || val === 5) return 'error';
        if (val === 1) return '';
        return 'success';
    };

    let dateTimeStr = `${data.dBookingDate || ''} ${data.tFromTime || ''} - ${data.tToTime || ''}`;
    if (!data.dBookingDate && data.vBookingDate) dateTimeStr = `${data.vBookingDate} ${data.vBookingTime || ''}`;

    const charImg = getImageUrl(data.vImage || data.txCharacterPic || data.vCharacterImage);

    const safeNum = (v1, v2, v3, v4, fallback = 0) => {
        const val = v1 ?? v2 ?? v3 ?? v4 ?? fallback;
        const num = parseFloat(val);
        return isNaN(num) ? fallback.toFixed(2) : num.toFixed(2);
    };

    return (
        <div className="booking-details-container">
            <Header title="Booking Details" onBack={() => navigate(-1)} />

            <div className="details-card-wrapper">
                <div className="card">
                    {/* User Info Header */}
                    <div className="user-header">
                        <div className="avatar">
                            {getAvatar() ? <img src={getAvatar()} alt="" /> : <PersonIcon />}
                        </div>
                        <div className="info">
                            <h2>{getUserName()}</h2>
                            <div className="phone"><PhoneIcon /> {phoneStr || 'N/A'}</div>
                            <div className={`status ${getStatusCls(data.tiStatus)}`}>
                                Payment Status: <span>{paymentStatus}</span>
                            </div>
                        </div>
                    </div>

                    <div className="divider" />

                    {/* Character Banner */}
                    <div className="char-banner">
                        <img src={charImg} alt="" />
                        <div className="details">
                            <label>Character Name</label>
                            <h4>{data.vCharacterName || data.charName || 'Unknown'}</h4>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="column">
                            <DetailItem label="Delivery Date" value={dateTimeStr || 'N/A'} isPrimary />
                            <DetailItem label="Occasion" value={data.vOccasion || detailsObj.vOccasion || 'N/A'} />
                            
                            <div className="detail-item">
                                <label>Recipient Details</label>
                                <div className="value"><PersonIcon /> {data.vRcepientName || recipientObj.vRecipientName || 'N/A'}</div>
                            </div>

                            <DetailItem label="Location Name" value={data.vLocationName || locationObj.vLocationName || 'N/A'} />

                            <div className="detail-item">
                                <label>Location Address</label>
                                <div className="value"><LocationIcon /> {data.vLocationAddress || locationObj.vStreetAddress || 'N/A'}</div>
                            </div>

                            <div className="detail-item">
                                <label>Contact Person Details @Delivery Location</label>
                                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <div className="value"><PersonIcon /> {data.vContactPersonDeliveryLocation || locationObj.vContactPersonName || 'N/A'}</div>
                                    <div className="value primary"><PhoneIcon /> {data.vPhoneNumberDeliveryLocation || locationObj.vContactPersonNumber || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="column">
                            <DetailItem label="Special Instruction for the location" value={data.vSpecialInstructions || data.txSpecialInstruction || 'N/A'} />
                            <DetailItem label="Recipient Personal Info" value={data.vRecipientPersonalInfo || recipientObj.txPersonalInfo || 'N/A'} />
                            <DetailItem label="Card Message" value={data.vCardMessage || detailsObj.txCardMessage || 'N/A'} />
                            <DetailItem label="From" value={data.vCardFrom || detailsObj.vFrom || 'N/A'} />
                            <DetailItem label="Additional Notes" value={data.vAdditionalNotes || detailsObj.txAdditionalNotes || 'N/A'} />
                            <DetailItem label="Add-Ons Charges" value={data.dAddOnCharges || paymentObj?.fAddOnAmount ? `$${data.dAddOnCharges || paymentObj.fAddOnAmount}` : '-'} />
                        </div>
                    </div>

                    <div className="actions">
                        {![3, 5, '3', '5'].includes(data.tiStatus) && (
                            <button className="payout-btn" onClick={() => setIsPayoutOpen(true)}>Payout Details</button>
                        )}
                        <a className="policy-link" onClick={() => navigate('/dashboard/cancellation-policy')}>Booking Cancellation Policy</a>
                    </div>
                </div>
            </div>

            {/* Payout Details Drawer */}
            {isPayoutOpen && (
                <div className="drawer-overlay" onClick={() => setIsPayoutOpen(false)}>
                    <div className="drawer-content" onClick={e => e.stopPropagation()}>
                        <div className="handle" />
                        <div className="drawer-header">
                            <h3>Payout Details</h3>
                            <button className="close-btn" onClick={() => setIsPayoutOpen(false)}><CloseIcon /></button>
                        </div>
                        
                        <div className="payout-list">
                            <PayoutRow label="Singing Telegram Base" amount={safeNum(paymentObj.fPayableAmount, paymentObj.dPayableAmount, data.dTotalAmount)} />
                            <PayoutRow label="Tip Amount" amount={safeNum(paymentObj.fTipAmount, paymentObj.dTipAmount, data.dDriverTip)} />
                            <PayoutRow label="Travel Fee" amount={safeNum(paymentObj.fTravelFee, paymentObj.dTravelFee, data.dTravelFee)} />
                            <PayoutRow label="Add-Ons Reimbursement" amount={safeNum(paymentObj.fAddOnAmount, paymentObj.dAddOnReimbursement, data.dAddOnCharges)} />
                        </div>

                        <div className="divider dashed" style={{ margin: '1.5rem 0' }} />
                        
                        <div className="total-payout">
                            <span className="label">Total Payout</span>
                            <span className="amount">${safeNum(paymentObj.fTotalAmount, paymentObj.dTotalPayout, data.dDriverTotalAmount, data.fPrice)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value, isPrimary }) => (
    <div className="detail-item">
        <label>{label}</label>
        <div className={`value ${isPrimary ? 'primary' : ''}`}>{value}</div>
    </div>
);

const PayoutRow = ({ label, amount }) => (
    <div className="payout-row">
        <span className="label">{label}</span>
        <span className="amount">${amount}</span>
    </div>
);

export default BookingHistoryDetails;