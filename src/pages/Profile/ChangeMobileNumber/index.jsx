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
        alert(`OTP sent to +1 ${mobileNumber}`);
    };

    return (
        <div className="change-mobile-container">
            <Header title="Change Number" />

            <div className="change-mobile-wrapper">
                <main className="change-card">
                    <h2>Change Mobile Number</h2>

                    <form className="change-form" onSubmit={handleSubmit}>
                        <div className="input-field">
                            <label>Mobile Number</label>
                            <div className="phone-input-wrapper">
                                <span className="country-code">+1</span>
                                <input 
                                    type="tel" 
                                    value={mobileNumber} 
                                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Number"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn"
                        >
                            Send OTP
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}
