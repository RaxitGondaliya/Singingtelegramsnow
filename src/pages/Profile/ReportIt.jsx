import React, { useState } from 'react';
import Header from '../../components/Header';
import './ReportIt.css';

const ReportIt = () => {
    const [reason, setReason] = useState('');
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ reason, comment });
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
                                <option value="" disabled>Select Reason</option>
                                <option value="inaccurate">Inaccurate Information</option>
                                <option value="harassment">Harassment</option>
                                <option value="spam">Spam</option>
                                <option value="other">Other</option>
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
                        <button type="submit" className="btn-submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportIt;