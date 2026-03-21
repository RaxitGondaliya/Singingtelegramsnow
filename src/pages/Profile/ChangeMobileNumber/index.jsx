import React, { useState } from 'react';
import Header from '../../../components/layout/Header/Header';
import './ChangeMobileNumber.scss';

export default function ChangeMobileNumber() {
    const [mobileNumber, setMobileNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mobileNumber.trim() === '') {
            alert('Please enter a valid mobile number');
            return;
        }

        // Simulating OTP send / API call
        alert(`OTP sent to +1 ${mobileNumber}`);
    };

    return (
        <div className="change-mobile-container">
            <Header title="Change Number" />

            <div className="change-mobile-content">
                <h2 className="page-title">Change Mobile Number</h2>

                <form className="mobile-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="input-label">Mobile Number</label>
                        <div className="phone-input-container">
                            <span className="country-code">+1</span>
                            <input
                                type="tel"
                                className="phone-input"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))} // Numeric only
                                placeholder=""
                            />
                        </div>
                    </div>

                    <button type="submit" className="send-otp-btn">
                        Send OTP
                    </button>
                </form>
            </div>
        </div>
    );
}
