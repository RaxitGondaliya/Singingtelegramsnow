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
                showMessage(response.data?.responseMessage || 'Failed to submit report.', 'error');
            }
        } catch (err) {
            console.error('Error submitting report:', err);
            showMessage('An error occurred. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="report-container">
            <Header title="Report It" onBack={() => navigate(-1)} />

            <div className="report-wrapper">
                <main className="report-card">
                    <h2>Report User</h2>

                    <form className="report-form" onSubmit={handleSubmit}>
                        <div className="input-field">
                            <label>Reason</label>
                            <select 
                                value={reason} 
                                onChange={(e) => setReason(e.target.value)}
                                disabled={loading}
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

                        <div className="input-field">
                            <label>Your Comment</label>
                            <textarea 
                                placeholder="Provide more details about the issue..."
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting Report...' : 'Submit Report'}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default ReportIt;
