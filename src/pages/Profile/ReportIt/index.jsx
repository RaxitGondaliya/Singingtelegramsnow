import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { bookingApi } from '../../../api/bookingApi';
import { useMessage } from '../../../context/MessageContext';
import './ReportIt.scss';

const ReportIt = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const bookingId = id || location.state?.iBookingId || localStorage.getItem('reportBookingId') || '';

    const [reason, setReason] = useState('');
    const [reasonsList, setReasonsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [comment, setComment] = useState('');
    const { showMessage } = useMessage();

    useEffect(() => {
        const fetchReasonsList = async () => {
            try {
                setLoading(true);
                const response = await bookingApi.getReportCustomerReasonsList();
                if (response.data && response.data.responseData) {
                    setReasonsList(response.data.responseData);
                } else if (response.data && response.data.data) {
                    setReasonsList(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setReasonsList(response.data);
                }
            } catch (error) {
                console.error("Error fetching report reasons:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReasonsList();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason) {
            showMessage('Please select a reason', 'error');
            return;
        }

        if (!bookingId) {
            showMessage('Missing Booking ID. Cannot submit report.', 'error');
            return;
        }

        try {
            setSubmitting(true);
            const response = await bookingApi.reportCustomer(bookingId, reason, comment);

            if (response.data && response.data.responseCode === 200) {
                showMessage(response.data.responseMessage || 'Report submitted successfully', 'success');
                setTimeout(() => navigate(-1), 2000);
            } else {
                showMessage(response.data?.responseMessage || 'Failed to submit report. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Error submitting report:', err);
            showMessage('An error occurred. Please try again later.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="report-page">
            <Header title="Report It" />

            <div className="report-container">
                <form className="report-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Reason</label>
                        <div className="select-wrapper">
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>{loading ? "Loading reasons..." : "Select Reason"}</option>
                                {reasonsList && reasonsList.map((item, index) => {

                                    const value = typeof item === 'object' ? (item.id || item.iReasonId || item.value || JSON.stringify(item)) : item;
                                    const label = typeof item === 'object' ? (item.vReason || item.name || item.title || item.label || JSON.stringify(item)) : item;

                                    return (
                                        <option key={index} value={value}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Your Comment</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="form-textarea"
                            rows="4"
                        />
                    </div>

                    <div className="button-container">
                        <button type="submit" className="btn-submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportIt;
