import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { bookingApi } from '../../../api';
import { useMessage } from '../../../context/MessageContext';
import './CancelBooking.scss';

const CancelBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showMessage } = useMessage();
    const bookingId = location.state?.bookingId;

    const [reasonsList, setReasonsList] = useState([]);
    const [selectedReason, setSelectedReason] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!bookingId) {
            navigate('/dashboard/my-bookings');
            return;
        }
        fetchReasons();
    }, [bookingId]);

    const fetchReasons = async () => {
        try {
            const response = await bookingApi.getReportCustomerReasonsList();
            if (response.data && response.data.responseData) {
                setReasonsList(response.data.responseData);
            } else if (response.data && response.data.data) {
                setReasonsList(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    const handleSubmit = async () => {
        if (!selectedReason) {
            showMessage('Please select a reason', 'error');
            return;
        }

        try {
            setSubmitting(true);
            const response = await bookingApi.cancelBooking(bookingId, selectedReason, comment);
            const data = response.data || {};

            if (data.responseCode === 200 || data.status === 200 || data.status === 1) {
                showMessage(data.responseMessage || 'Booking cancelled successfully', 'success');
                navigate('/dashboard/booking-requests');
            } else {
                showMessage(data.responseMessage || 'Failed to cancel booking', 'error');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            showMessage('An error occurred during cancellation.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="cancel-booking-page">
            <Header title="Cancel Booking" />

            <div className="form-container">
                <div className="form-group">
                    <label>Reason</label>
                    <div className="select-wrapper">
                        <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                        >
                            <option value="">Select Reason</option>
                            {reasonsList.map((reason) => (
                                <option key={reason.iReasonId} value={reason.iReasonId}>
                                    {reason.vReason}
                                </option>
                            ))}
                        </select>
                        <div className="underline"></div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Your Comment</label>
                    <div className="input-wrapper">
                        <textarea
                            rows="1"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                        />
                        <div className="underline"></div>
                    </div>
                </div>

                <div className="button-footer">
                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelBooking;
