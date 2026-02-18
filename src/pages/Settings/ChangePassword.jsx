import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';
import Header from '../../components/Header';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="change-password-container">
            <Header title="Change Password" />

            <div className="change-password-content">
                <div className="input-group">
                    <label>Current Password</label>
                    <input
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        name="new"
                        value={passwords.new}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handleChange}
                    />
                </div>

                <button className="change-password-btn">
                    Change Password
                </button>
            </div>
        </div>
    );
}
